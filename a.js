const apikey = 'api_key=a72013bef9d421559ffc49b5f0a02dcd';
const base_url = 'https://api.themoviedb.org/3/';
const api_url = base_url + '/discover/movie?sort_by=popularity.desc&' + apikey;
const img_url = 'https://image.tmdb.org/t/p/w500';
const searchUrl = base_url + '/search/movie?' + apikey;

const genres = {
    "genres": [
        {
            "id": 28,
            "name": "Action"
        },
        {
            "id": 12,
            "name": "Adventure"
        },
        {
            "id": 16,
            "name": "Animation"
        },
        {
            "id": 35,
            "name": "Comedy"
        },
        {
            "id": 80,
            "name": "Crime"
        },
        {
            "id": 99,
            "name": "Documentary"
        },
        {
            "id": 18,
            "name": "Drama"
        },
        {
            "id": 10751,
            "name": "Family"
        },
        {
            "id": 14,
            "name": "Fantasy"
        },
        {
            "id": 36,
            "name": "History"
        },
        {
            "id": 27,
            "name": "Horror"
        },
        {
            "id": 10402,
            "name": "Music"
        },
        {
            "id": 9648,
            "name": "Mystery"
        },
        {
            "id": 10749,
            "name": "Romance"
        },
        {
            "id": 878,
            "name": "Science Fiction"
        },
        {
            "id": 10770,
            "name": "TV Movie"
        },
        {
            "id": 53,
            "name": "Thriller"
        },
        {
            "id": 10752,
            "name": "War"
        },
        {
            "id": 37,
            "name": "Western"
        }
    ]
}

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

const tagsElement = document.getElementById('tags');


var selectedgenre = []
setGenres();
function setGenres()
{
    tagsElement.innerHTML = '';
    genres.genres.forEach(genre =>
    {
        const tag = document.createElement('div');
        tag.classList.add('tag');
        tag.id = genre.id;
        tag.innerText = genre.name;
        tag.addEventListener('click', () =>
        {
            if (selectedgenre.length == 0)
            {
                selectedgenre.push(genre.id);
            } else
            {
                if (selectedgenre.includes(genre.id))
                {
                    selectedgenre.forEach((id, idx) =>
                    {
                        if (id == genre.id)
                        {
                            selectedgenre.splice(idx, 1);
                        }
                    })
                } else
                {
                    selectedgenre.push(genre.id);
                }
            } console.log(selectedgenre);
            getMovies(api_url + '&with_genres=' + encodeURI(selectedgenre.join(',')));
            hilightSelection();
        })
        tagsElement.append(tag);
    })
}
function hilightSelection()
{   
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag =>
    {
        tag.classList.remove('highlight');
    });
    if (selectedgenre.length != 0)
    {
        selectedgenre.forEach(id =>
        {
            const hilightSelection = document.getElementById(id);
            hilightSelection.classList.add('highlight')
        })
    }
}

getMovies(api_url);

async function getMovies(url)
{
    try
    {
        const res = await fetch(url);
        const data = await res.json();
        showMovies(data.results);
        if (data.results.length !== 0)
        {
            showMovies(data.results);
        } else
        {
            main.innerHTML = `<h1 class="no_results">no results found</h1>`;
        }
    } catch (error)
    {
        console.log(error);
    }
}

function showMovies(data)
{
    const fragment = document.createDocumentFragment();

    data.forEach((movie) =>
    {
        const { title, poster_path, vote_average, overview } = movie;
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
        <img src="${img_url + poster_path }" alt="${title}">
        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>
        <div class="overview">
            <h1>Overview</h1>
            ${overview}
        </div>
        `;

        fragment.appendChild(movieElement);
    });

    main.innerHTML = '';
    main.appendChild(fragment);
}

function getColor(vote)
{
    if (vote >= 8)
    {
        return 'green';
    } else if (vote >= 5)
    {
        return 'orange';
    } else
    {
        return 'red';
    }
}

form.addEventListener('submit', async (e) =>
{
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm)
    {
        const searchUrlWithQuery = searchUrl + '&query=' + searchTerm;
        await getMovies(searchUrlWithQuery);
        search.value = '';
    }
});