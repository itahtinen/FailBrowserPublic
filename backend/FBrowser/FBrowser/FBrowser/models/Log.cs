using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace FBrowser.models
{
    [Table("t_log")]
    public class Log
    {
        public string id { get; set; }
        public string name { get; set; }
        public string generated { get; set; }
        public ICollection<Sample> Sample { get; set; }
    }
}
