using System.Text.Json;
using API.RequestHelpers;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        // add a header for cors
        public static void AddPaginationHeader(this HttpResponse response, MetaData metaData)
        {
            // in keeping with JSON convention
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            
            // send the paging info back to the client
            // MetaData is created in the productsList
            response.Headers.Add("Pagination", JsonSerializer.Serialize(metaData, options));
            
            // cors - allows client to read our custom header
            response.Headers.Add("Access-Control-Expose-Headers","Pagination");
        }
    }
}