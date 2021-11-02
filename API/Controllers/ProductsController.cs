using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;
        
        public ProductsController(StoreContext context)
        {
            _context = context;
        }

        // GET
        [HttpGet]
        public async Task<ActionResult<List<Product>>> Index()
        {
            return await _context.Products.ToListAsync();

            //return Ok(products);
        }

        [HttpGet("{id}")] // api/products/3
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            // if we specify a nonsense id and the product is null then this returns a 204 No content
            // which isn't what we want - check product is not null...
            var product =  await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            return product;
        }
    }
}