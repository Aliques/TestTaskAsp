using System;

namespace TestTaskBrio.Domain.Core
{
    public class Marker
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public float X { get; set; }
        public float Y { get; set; }
        public DateTime CreationTime { get; set; } = DateTime.Now;
    }
}
