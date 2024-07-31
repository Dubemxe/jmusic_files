// Search function to retrieve music data from the spotify api
async function searchSong() {
    try {
        const query = document.getElementById('searchQuery').value.trim();
        if (!query) {
            console.log('Please enter a song title');
            return;
        }
	// Personal nocodeapi url
        const searchUrl = `https://v1.nocodeapi.com/vivalog/spotify/WAwCeOnCnQHWrEVP/search?q=${encodeURIComponent(query)}&type=track`; //`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`;

        const response = await fetch(searchUrl);

        if (!response.ok) {
            throw new Error('Failed to search for the song');
        }

        const data = await response.json();
        const trackItems = data.tracks.items;

        if (trackItems.length === 0) {
            console.log('No songs found');
            return;
        }
	// Get all available response from search
        const songListHTML = trackItems.map(track => {
            const artists = track.artists.map(artist => artist.name).join(', ');
	    const audioPreview = track.preview_url ? `<audio controls><source src="${track.preview_url}" type="audio/mpeg">Your browser does not support the audio element.</audio>` : '';
            const trackHTML = `
                <div class="musicInfo">
		<img src="${track.album.images[0].url}" alt="${track.name} by ${artists}" class="albumImage">
		<p class="artistName">${artists}</p>
                    <p class="songTitle"> - ${track.name}</p>
		    ${audioPreview}
                </div>
            `; // ${audioPreview}
            return trackHTML;
        }).join('');

        document.getElementById('songList').innerHTML = songListHTML;

    } catch (error) {
        console.error('Error searching for the song:', error);
    }
}

async function getTrackIdByArtist(artistName) {
  try {

    // Encode the artist name for use in the URL
    const encodedArtistName = encodeURIComponent(artistName);

    // Construct the search URL for tracks by the artist
    const searchUrl = `https://v1.nocodeapi.com/vivalog/spotify/WAwCeOnCnQHWrEVP/search?q=${encodedArtistName}&type=track`;

    // Make a GET request to the search URL with the Spotify API access token
    const response = await fetch(searchUrl);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch tracks by artist');
    }

    // Parse the response JSON
    const data = await response.json();

    // Extract the track IDs from the response
    let trackIds = data.tracks.items.map(item => item.id);

    trackIds = trackIds.slice(0, 5);

    // Return the array of track IDs
    return trackIds;
  } catch (error) {
    console.error('Error fetching track IDs by artist:', error);
    return [];
  }
}


async function getSongInfo(trackIds) {
  try {

      const accessToken = 'BQDkhdKP3tVG7yt7kZ8kMEqx4uuV-hrBGrPuQJBjLw_ooU5j-bJX0Fb1tiRuC1M7hgDUezxwukHa2XakzpOIXoNRTn8Z7pYrPslOhBgrlzG7cO5DvV-U12p4TPkOhWZjlAhrNpeqHEWfBo-5idv9YoXq0q4WShRrDfpzN2uHRO0maDr1wZyglSH_6t0SkhiNgFA7UD8elwUccX1zKgs-ilgbVqmL';
	

    // get ID with my function
    //const trackIds = await getTrackIdByArtist();
    
    const songInfoPromises = trackIds.map(async (trackId) => {
	    const trackInfoUrl =  `https://api.spotify.com/v1/tracks/${trackId}`;
	    const response = await fetch(trackInfoUrl, {
		    headers: {
			    Authorization: `Bearer ${accessToken}`
      }
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch song info');
    }

    // Parse the response JSON
    const data = await response.json();
    const artistsR = data.artists.map(artist => artist.name).join(', ');
    // Extract the song information from the response
    const songInfoHTML = `
    	<div class="musicInfo">
	<img src="${data.album.images[0].url}" alt="${data.name} by ${artistsR}" class="albumImage">
      <p class="artistName">${data.artists.map(artist => artist.name).join(', ')}</p>
      <p class="songTitle">${data.name}</p>
      <p class="duration">${msToTime(data.duration_ms)}</p>
      </div>
		`;
    // Return the song information
    return songInfoHTML;
    });

    const songInfos = await Promise.all(songInfoPromises);
    return songInfos;
    } catch (error) {
    console.error('Error fetching song info:', error);
    return [];
  }
}
function msToTime(duration) {
  const minutes = Math.floor(duration / 60000);
  const seconds = ((duration % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

 //usage
getSongInfo()
  .then(songInfoHTML => {
    if (songInfoHTML) {
	document.getElementById('songList').innerHTML = songInfoHTML;
          } else {
      console.log('Failed to fetch song info');
    }
  });

async function displaySongsInfo() {
      const trackIds = JSON.parse(localStorage.getItem('trackIds')) || [];
      const songList = document.getElementById('songList');

      for (const trackId of trackIds) {
        const songInfoHTML = await getSongInfo(trackIds);
	    songList.innerHTML +=  songInfoHTML;
	
    }
	console.error('No track IDs found in local storage');
}
displaySongsInfo();
