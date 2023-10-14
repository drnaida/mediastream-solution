/**
 * Exercise 01: The Retro Movie Store
 * Implement a shopping cart with the next features for the Movie Store that is selling retro dvds:
 * 1. Add a movie to the cart - Done
 * 2. Increment or decrement the quantity of movie copies. If quantity is equal to 0, the movie must be removed from the cart++
 * 3. Calculate and show the total cost of your cart. Ex: Total: $150++
 * 4. Apply discount rules. You have an array of offers with discounts depending of the combination of movie you have in your cart.
 * You have to apply all discounts in the rules array (discountRules).
 * Ex: If m: [1, 2, 3], it means the discount will be applied to the total when the cart has all that products in only.
 * 
 * You can modify all the code, this component isn't well designed intentionally. You can redesign it as you need.
 */

import './assets/styles.css'
import { useState } from 'react'

export default function Exercise01 () {
  /* available movies array */
  const movies = [
    {
      id: 1,
      name: 'Star Wars',
      price: 20
    },
    {
      id: 2,
      name: 'Minions',
      price: 25
    },
    {
      id: 3,
      name: 'Fast and Furious',
      price: 10
    },
    {
      id: 4,
      name: 'The Lord of the Rings',
      price: 5
    }
  ];

  /* discount rules */
  const discountRules = [
    {
      m: [3, 2],
      discount: 0.25
    },
    {
      m: [2, 4, 1],
      discount: 0.5
    },
    {
      m: [4, 2],
      discount: 0.1
    } 
  ];

  /* cart for buying movies */
  const [cart, setCart] = useState([
    {
      id: 1,
      name: 'Star Wars',
      price: 20,
      quantity: 2
    }
  ]);

  /* function that calculates total price */
  const getTotal = () => {
    let discountToApply = 1;
    /* sort array with discounts */
    const sortedDiscounts = discountRules.map(discount => ({
      ...discount,
      m: discount.m.slice().sort((a, b) => a - b)
    }));

    /* array that stores what movies ids we are buying */
    const moviesIdsInCart = [];
    cart.map(item => {
      moviesIdsInCart.push(item.id);
    });
    
    /* sort the array with movie ids */
    moviesIdsInCart.sort((a, b) => a - b);
    
    /* compare if our movies in the cart satisfy some discount condition */
    sortedDiscounts.map((discount) => {
      if (discount.m.toString() === moviesIdsInCart.toString()) {
        discountToApply = discount.discount;
      }
    });

    /* return the calculated price with discount */
    return cart.reduce((total, movie) => total + (movie.price * movie.quantity), 0) * discountToApply;
  }

  return (
    <section className="exercise01">
      <div className="movies__list">
        <ul>
          {movies.map(movie => (
            <MovieCard movie={movie} cart={cart} setCart={setCart}/>
          ))}
        </ul>
      </div>
      <div className="movies__cart">
        <ul>
          {cart.map(item => (
            <CartItemCard item={item} cart={cart} setCart={setCart}/>
          ))}
        </ul>
        <div className="movies__cart-total">
          <p>Total: ${getTotal()}</p>
        </div>
      </div>
    </section>
  )
};

/* component with one movie card */
function MovieCard({movie, cart, setCart}) {

  /* contant that check whether movie is already in the cart */
  const isMovieInCart = cart.some(item => item.id === movie.id);

  /* function that adds movie to the cart */
  const addToCart = (movie) => {
    const newMovie = movie;
    newMovie.quantity = 1;
    setCart(
      [
        ...cart,
        movie
      ]
    )
  };
  return (
    <li className="movies__list-card">
      <ul>
        <li>
          ID: {movie.id}
        </li>
        <li>
          Name: {movie.name}
        </li>
        <li>
          Price: ${movie.price}
        </li>
      </ul>
      <button disabled={isMovieInCart} className={isMovieInCart ? 'movies__list-card--button-disabled' : 'movies__list-card--button'} onClick={() => {
          addToCart(movie)
      }}>
        {isMovieInCart ? 'Already in cart' : 'Add to cart'} 
      </button>
    </li>
  )
};

/* component with one card item */
function CartItemCard({item, cart, setCart}) {

  /* function that increase the amount of the movie in the cart by one */
  const incrementMovieCopyQuantity = (id) => {
    const newCart = cart.map((c, i) => {
      if (c.id === id) {
        c.quantity += 1;
      }
      return c;
    });
    setCart(newCart);
  };

  /* function that decreases the amount of the movie in the cart by one */
  const decrementMovieCopyQuantity = (id) => {
    let gotDeleted = false;
    let deletedItemIndex = -1;
    const newCart = cart.map((c, i) => {
      if (c.id === id) {
        c.quantity -= 1;
        /* if quantity becomes lower than 1, remember that */
        if (c.quantity <= 0) {
          gotDeleted = true;
          deletedItemIndex = i;
        }
      }
      return c;
    });

    /* delete the movie if its quantity is below 1 */
    if (gotDeleted) {
      const updatedCart = [...cart];
      updatedCart.splice(deletedItemIndex, 1);
      setCart(updatedCart); 
    } else {
      setCart(newCart);
    }
  };

  return (
    <li className="movies__cart-card">
      <ul>
        <li>
          ID: {item.id}
        </li>
        <li>
          Name: {item.name}
        </li>
        <li>
          Price: ${item.price}
        </li>
      </ul>
      <div className="movies__cart-card-quantity">
        <button onClick={() => decrementMovieCopyQuantity(item.id)}>
          -
        </button>
        <span>
          {item.quantity}
        </span>
        <button onClick={() => incrementMovieCopyQuantity(item.id)}>
          +
        </button>
      </div>
    </li>
  )
};