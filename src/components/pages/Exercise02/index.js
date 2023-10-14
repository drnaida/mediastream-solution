/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Exercise 02: Movie Library
 * We are trying to make a movie library for internal users. We are facing some issues by creating this, try to help us following the next steps:
 * !IMPORTANT: Make sure to run yarn movie-api for this exercise
 * 1. We have an issue fetching the list of movies, check why and fix it (handleMovieFetch) Done
 * 2. Create a filter by fetching the list of gender (http://localhost:3001/genres) and then loading
 * list of movies that belong to that gender (Filter all movies). Done
 * 3. Order the movies by year and implement a button that switch between ascending and descending order for the list
 * 4. Try to recreate the user interface that comes with the exercise (exercise02.png)
 * 
 * You can modify all the code, this component isn't well designed intentionally. You can redesign it as you need.
 */

import "./assets/styles.css";
import { useEffect, useState } from "react";

export default function Exercise02 () {
  /* state that stores movies and genres lists */
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [fetchCount, setFetchCount] = useState(0);

  /* state that stores whether data is still loading */
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingGenres, setLoadingGenres] = useState(false);

  /* state that needed to store selected genre for filtering */
  const [selectedGenre, setSelectedGenre] = useState('');

  /* state that needed to sort movies by year */
  const [orderByYearDirection, setOrderByYearDirection] = useState('desc');
  const [orderByYearButtonText, setOrderByYearButtonText] = useState('Year Ascending');

  /* state that needed for pagination */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  /* function that fetches movies list */
  const handleMovieFetch = () => {
    setLoadingMovies(true);
    setFetchCount(fetchCount + 1);
    fetch(`http://localhost:3001/movies?genres_like=${selectedGenre}&_sort=year&_order=${orderByYearDirection}&_page=${page}&_limit=${pageSize}`)
      .then(res => res.json())
      .then(json => {
        setMovies(json);
        setLoadingMovies(false);
      })
      .catch(() => {
        console.log('Run yarn movie-api for fake api');
      })
  };

  /* function that fetches genres list */
  const handleGenresFetch = () => {
    setLoadingGenres(true);
    fetch('http://localhost:3001/genres')
      .then(res => res.json())
      .then(json => {
        setGenres(json);
        setLoadingGenres(false);
      })
      .catch(() => {
        console.log('Run yarn movie-api for fake api');
      })
  };

  /* triggers fetch of movies when the page loads, or if the genre was selected, or sort by year activated */
  useEffect(() => {
    handleMovieFetch();
  }, [selectedGenre, orderByYearDirection, page]);

  /* triggers fetch of genres when the page loads */
  useEffect(() => {
    handleGenresFetch();
  }, []);

  /* sets the selected genre */
  const handleGenreChange = (event) => {
    setPage(1);
    setSelectedGenre(event.target.value);
  };

  /* swaps sort button between ascending and descending */
  const handleOrderByYear = () => {
    if (orderByYearDirection == 'desc') {
      setOrderByYearDirection('asc');
      setOrderByYearButtonText('Year Descending');
    } else {
      setOrderByYearDirection('desc');
      setOrderByYearButtonText('Year Ascending');
    }
  }

  return (
    <section className="movie-library">
      <div className="movie-library--background">
        <h1 className="movie-library__title">
          Movie Library
        </h1>
        <div className="movie-library__actions">
          <select className="movie-library__actions--select" name="genre" placeholder="Search by genre..." onChange={handleGenreChange}>
          <option value=''>All Genres</option>
            {genres.map((genre) => (
              <option value={genre}>{genre}</option>
            ))};
          </select>
          <button className="movie-library__actions--button" onClick={() => {handleOrderByYear()}}
          >
            {orderByYearButtonText}
          </button>
        </div>
      </div>
      {(loadingMovies && loadingGenres) ? (
        <div className="movie-library__loading">
          <p className="movie-library__loading--text">Loading...</p>
          <p>Fetched {fetchCount} times</p>
        </div>
      ) : (<>
        <ul className="movie-library__list">
          {movies.length != 0 && movies.map(movie => (
            <li key={movie.id} className="movie-library__card" style={{ 
              backgroundImage: `url(${movie.posterUrl})`,
              backgroundRepeat: 'no-repeat',
            }}>
              <ul className="movie-library__card--info">
                <li className="movie-library__card--title">{movie.title}</li>
                <li className="movie-library__card--genres">{movie.genres.join(', ')}</li>
                <li className="movie-library__card--year">{movie.year}</li>
              </ul>
            </li>
          ))}
        </ul>
        {movies.length == 0 && <div className="movie-library__list--empty">No movies found.</div>}
        <div className="movie-library__pagination">
          <button className={page === 1 ? 'movie-library__pagination--button-disabled' : 'movie-library__pagination--button'} disabled={page === 1} onClick={() => {setPage(page - 1)}}>
            Previous
          </button>
          <button className="movie-library__pagination--button" onClick={() => {setPage(page + 1)}}>
            Next
          </button>
        </div>
        </>)}
    </section>
  )
}