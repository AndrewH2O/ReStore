using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("BasketItems")]
    public class BasketItem
    {
        public int Id { get; set; }

        public int Quantity { get; set; }
        
        // navigation properties
        public int ProductId { get; set; }

        //One to one
        public Product Product { get; set; }
        
        // Navigation properties - define both ends of navigation if we want cascade delete
        public int BasketId { get; set; }

        public Basket Basket { get; set; }
    }
}