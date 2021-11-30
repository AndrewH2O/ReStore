using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    public class PagedList<T> : List<T>
    {
        public MetaData MetaData { get; set; }

        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            MetaData = new MetaData()
            {
                TotalCount = count,
                CurrentPage = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(count / (double)pageSize) // rounds up
            };
            
            AddRange(items);
        }

        public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize)
        {
            var count = await query.CountAsync(); // executed on db
            
            // pageSize 10 page 1 - 1  ->skip(0*10) i.e. skip nothing for page 1
            //             page 2 - 1  ->skip(1*10) skip first 10 
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync(); // executed on db
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
    
}