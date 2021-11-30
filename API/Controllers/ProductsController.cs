using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
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
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery]ProductParams productParams)
        {
            // using our orderBy extension method
            var query = _context.Products
                .Sort(productParams.OrderBy)
                .Search(productParams.SearchTerm)
                .Filter(productParams.Brands, productParams.Types)
                .AsQueryable();

            var products =
                await PagedList<Product>.ToPagedList(query, 
                    productParams.pageNumber, productParams.PageSize);

            // add camel case JSON formatting and page metadata
            Response.AddPaginationHeader(products.MetaData);
            
            return products;

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
        
        // don't get type safety with response when returning IActionResult doesn't matter as get anon object
        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();
            return Ok(new { brands, types });
        }
    }
}