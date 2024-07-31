function changeUrl(url) {
                window.location.href = url;
                }



async function getTrackIdsByArtist(artistName) {
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

    // Set limit to 5
    trackIds = trackIds.slice(0, 5);

    // Return the array of track IDs
    console.log("Top tracks:", trackIds);
    return trackIds;
  } catch (error) {
    console.error('Error fetching track IDs by artist:', error);
    return [];
  }
}
async function myTop5(artistNames) {
    let allTrackIds = [];

    for (const artist of artistNames) {
        const trackIds = await getTrackIdsByArtist(artist);
        allTrackIds = allTrackIds.concat(trackIds.slice(0, 5)); // Take top 5 tracks for each artist
    }
    localStorage.setItem('trackIds', JSON.stringify(allTrackIds));
    //window.location.href = 'searchpage';
}

// get info function
async function getArtistInfo(artistName) {
  try {
	  const accessToken =  'BQC3LLEtp2Qsx-lijYOfsYQjQbj_krsvseG-1odTqhWcAXqUWtBXYKhOJ7p0mXULnggEH25O0WabDOMinMT40bQ2yh4QNd5HxEJ-emeTVa9rMqkslq4oCPcndGM-CdyrJUQhuFJmZClbotSlKyDPAIuKk_-xFpNhBP9j0TDDEjb2PI75UhzVfv2Wpd_YwNYRDCtJTyGaX5NWr0M-bJoXhek';
    const searchUrl = `https://v1.nocodeapi.com/vivalog/spotify/WAwCeOnCnQHWrEVP/search?q=${encodeURIComponent(artistName)}&type=artist`;

    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch artist info');
    }

    const searchData = await response.json();
    const artist = searchData.artists.items[0];
    if (!artist) {
      return '<div>Artist not available</div>';
    }

// Extract track IDs from the artist's top tracks
    const topTracksResponse = await fetch(artist.href /*+ '/top-tracks?country=US'*/, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    //  Extracting the artist's top track IDs
    const topTrackIds = await topTracksResponse.json();
    const trackIds =  getTrackIdsByArtist(); //topTrackIds.tracks.map(track => track.id);

    // Handle the display in HTML format
    const artistInfoHTML = `
      <div>
      	<img src="${artist.images[0].url}" alt="${artist.name}" class="artist_image">

        <h2 class="name">${artist.name}</h2>
        <p class="followers">Followers: ${artist.followers.total}</p>
        <p class="rating">Rating: ${artist.popularity}</p>
      </div>
    `;
    //console.log('Top Track IDs:', trackIds);
    return  { artistInfoHTML, trackIds };
  } catch (error) {
    console.error('Error fetching artist info:', error);
    return '<div>Error fetching artist info</div>';
  }
}


/*async function getSongInfoAndAudioPreview(trackId) {
  try {
   const accessToken = 'BQDZHwrs8nyi5f3Rqw5eAQCBMjDpm6SoyXFTVQodVeY_BZDfyw68MebxzxSkacaRTOUs8ufwAbrECM1ST2YtMpu2z9sxNcT3SChn-S6l2t6hLop5y_2hqRf4UVS4kws-B5rggGNRYfLzSq-GA1C3tUrpjYn6aisFmnT74pd3y2GMNeuHkVeIMV_JGNYXOGLoDWSVh4ptZJtG-9-UmoD22Bs';
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch track info');
    }

    const trackData = await response.json();

    // Extract song information
    const songTitle = trackData.name;
    const artistName = trackData.artists.map(artist => artist.name).join(', ');
    const albumName = trackData.album.name;
    const audioPreviewUrl = trackData.preview_url;

    // Display song information on your web page
    console.log('Song Title:', songTitle);
    console.log('Artist:', artistName);
    console.log('Album:', albumName);
    console.log('Audio Preview URL:', audioPreviewUrl);

    if (audioPreviewUrl) {
      const audio = new Audio(audioPreviewUrl);
      audio.play();
    } else {
      console.log('No audio preview available for this track');
    }
  } catch (error) {
    console.error('Error fetching track info:', error);
  }
}*/



// Use put the display in  div1

const artistName = 'Drake';
const artistInfoDiv = document.getElementById('artistInfo');

getArtistInfo(artistName)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv.innerHTML = artistInfoHTML;
  });

// for div2
const artistName2 = 'Davido';
const artistInfoDiv2 = document.getElementById('artistInfo2');

getArtistInfo(artistName2)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv2.innerHTML = artistInfoHTML;
  });

/* for div3
const artistName3 = '21';
const artistInfoDiv3 = document.getElementById('artistInfo3');

getArtistInfo(artistName3)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv3.innerHTML = artistInfoHTML;
  });
// for div4
const artistName4 = 'Juice Wrld';
const artistInfoDiv4 = document.getElementById('artistInfo4');

getArtistInfo(artistName4)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv4.innerHTML = artistInfoHTML;
  });

// for div5
const artistName5 = 'Tyler The';
const artistInfoDiv5 = document.getElementById('artistInfo5');

getArtistInfo(artistName5)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv5.innerHTML = artistInfoHTML;
  });

// for div6
const artistName6 = 'Gunna';
const artistInfoDiv6 = document.getElementById('artistInfo6');

getArtistInfo(artistName6)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv6.innerHTML = artistInfoHTML;
  });

// for div7
const artistName7 = 'Tyla';
const artistInfoDiv7 = document.getElementById('artistInfo7');

getArtistInfo(artistName7)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv7.innerHTML = artistInfoHTML;
  });

// for div8
const artistName8 = 'Tems';
const artistInfoDiv8 = document.getElementById('artistInfo8');

getArtistInfo(artistName8)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv8.innerHTML = artistInfoHTML;
  });


// for div9
const artistName9 = 'Weekend';
const artistInfoDiv9 = document.getElementById('artistInfo9');

getArtistInfo(artistName9)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv9.innerHTML = artistInfoHTML;
  });*/
