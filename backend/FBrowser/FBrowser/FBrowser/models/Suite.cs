using System.ComponentModel.DataAnnotations.Schema;

namespace FBrowser.models
{
    [Table("t_suite")]
    public class Suite
    {
        public string id { get; set; }
        public string name { get; set; }
        public string parentid { get; set; }
    }
}
