namespace TestTaskBrio
{
    public class Marker
    {
        public float X { get; set; }
        public float Y { get; set; }
        public int Radius { get; set; }
        public NeighborMarker PreviousMarker { get; set; }
        public NeighborMarker NextMarker { get; set; }
    }

    public class NeighborMarker
    {
        public float X { get; set; }
        public float Y { get; set; }
    }
}
