using System.ComponentModel.DataAnnotations.Schema;

namespace FBrowser.models
{
    [Table("t_case")]
    public class Case
    {
        public string id { get; set; }
        public string name { get; set; }
        public string suiteid { get; set; }
    }
}
