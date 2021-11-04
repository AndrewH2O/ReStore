using System;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket();

            if (basket == null) return NotFound();
            // solve cyclical issue we had in JSON serialiser
            // where basket had a navigation property BasketItem which had a basket etc
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto()
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity,
                    Type = item.Product.Type
                }).ToList()
            };
        }

        // value from query string
        // api/basket?productId=3&quantity=2
        [HttpPost]
        public async Task<ActionResult> AddItemToBasket(int productId, int quantity)
        {
            // get basket or create basket
            var basket = await RetrieveBasket();
            if (basket == null) basket = CreateBasket(); 
            
            // get product
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return NotFound();
            
            // add item
            basket.AddItem(product, quantity);
            
            // save changes
            var result = await _context.SaveChangesAsync() > 0; // if true then we have something saved
            if (result) return StatusCode(201); // created at source

            return BadRequest(new ProblemDetails
            {
                Title = "Problem saving item to basket"
            });
        }

        

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            // get basket
            var basket = await RetrieveBasket();
            if (basket == null) return NotFound();
            
            // remove item or reduce quantity
            basket.RemoveItem(productId, quantity);
            
            // save changes
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();
                
            return BadRequest(new ProblemDetails
            {
                Title = "Problem removing item from the basket"
            });
        }

        private Basket CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions
            {
                IsEssential = true,
                Expires = DateTime.Now.AddDays(30),
            };
            // add cookie to response
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            var basket = new Basket { BuyerId = buyerId };
            _context.Baskets.Add(basket); // allows ef to track entity
            return basket;

        }
        
        private async Task<Basket> RetrieveBasket()
        {
            var basket = await _context.Baskets
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(b => b.BuyerId == Request.Cookies["buyerId"]);
            return basket;
        }
    }
}