using System.ComponentModel.DataAnnotations.Schema;

namespace FBrowser.models
{
    [Table("t_sample")]
    public class Sample
    {
        public int id { get; set; }
        public string name { get; set; }
        public string status { get; set; }
        public string caseid { get; set; }

        public Log log { get; set; }

        [ForeignKey("log")]
        public string logid { get; set; }
    }
}
