using System;

namespace TestTaskBrio.Domain.Core
{
    public class Marker
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public float X { get; set; }
        public float Y { get; set; }
        public int Radius { get; set; }
        public Marker NextMarker { get; set; }
        public DateTimeOffset CreationTime { get; set; } = DateTimeOffset.UtcNow;
    }
}
