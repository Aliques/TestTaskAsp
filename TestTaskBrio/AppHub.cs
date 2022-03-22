using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;
using TestTaskBrio.Domain.Core;
using TestTaskBrio.Domain.Interfaces;

namespace TestTaskBrio
{
    public class AppHub : Hub
    {
        private readonly IMarkerRepository _markerRepository;
        public AppHub(IMarkerRepository markerRepository)
        {
            _markerRepository = markerRepository;
        }
        public async Task GetNewMarker(Marker marker)
        {
            var createdMarker = await _markerRepository.CreateMarker(marker);
            await _markerRepository.SaveChangesAsync();
            await Clients.All.SendAsync("GetNewMarker", createdMarker);
        }

        public override async Task OnConnectedAsync()
        {
            var result = await _markerRepository.FindAllAsync();
            await Clients.Caller.SendAsync("GetAllMarkers", result);
            await base.OnConnectedAsync();
        }

        public async Task UpdateMarkers()
        {
            var result = await _markerRepository.FindAllAsync();
            await Clients.All.SendAsync("UpdateMarkers", result);
            await base.OnConnectedAsync();
        }

        public async Task DeleteMarker(Marker marker)
        {
            //_markerRepository.Delete(marker);
            //await _markerRepository.SaveChangesAsync();
            await Clients.Others.SendAsync("DeleteMarker", marker);
            await base.OnConnectedAsync();
        }

        public async Task RemoveAllMarkers()
        {
            await _markerRepository.RemoveAll();
            await _markerRepository.SaveChangesAsync();
            await Clients.All.SendAsync("RemoveAllMarkers");
            await base.OnConnectedAsync();
        }
    }
}