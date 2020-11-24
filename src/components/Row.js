import React, {useState, useEffect} from 'react';
import axios from './axios';
import "../style/Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({title, fetchUrl, isLargeRow}) {

    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    
    useEffect(()=>{
        // if [], run once when the row loads, and dont run again
        // if [movies], run everytime row loads and need data for new movies.
        async function fetchData(){
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results)
            return request;
        }
        fetchData()
    }, [fetchUrl]);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    };

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl("");
        } else {
            movieTrailer(movie?.name || "")
            .then((url) => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get("v"));
                console.log("Benjamin " + url)
                console.log("Benjamin " + movie.title)
                console.log("Benjamin " + movie.name)
            }).catch((error) => console.log(error));
        }
    };

    return (
        <div className="row">
             <h2>{title}</h2>

             <div className="row_posters">
             {movies.map( (movie) =>(
             <img 
             key={movie.id}
             onClick={() => handleClick(movie)}
             className={`row_poster ${isLargeRow && "row_posterLarge"}`}
             src={`${base_url}${
                 isLargeRow ? movie.poster_path : movie.backdrop_path
                }`} 
             alt={movie.name}
             />
             ))}
            </div>
            {trailerUrl && <Youtube videoId={trailerUrl} opts={opts}/>}
        </div>
    );
}

export default Row
