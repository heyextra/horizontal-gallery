const imageList = [
  {
    id: 1,
    imageUrl: "https://source.unsplash.com/random",
    relatedProducts: ["1", "2"],
  },
  {
    id: 2,
    imageUrl: "https://source.unsplash.com/random/?productshot",
    relatedProducts: ["1", "2"],
  },
  {
    id: 3,
    imageUrl: "https://source.unsplash.com/random",
    relatedProducts: ["1", "2", "3"],
  },
  {
    id: 2,
    imageUrl: "https://source.unsplash.com/random/?productshot",
    relatedProducts: ["1", "2"],
  },
  {
    id: 3,
    imageUrl: "https://source.unsplash.com/random",
    relatedProducts: ["1", "2"],
  },
  {
    id: 2,
    imageUrl: "https://source.unsplash.com/random/?productshot",
    relatedProducts: ["1", "2"],
  },
  {
    id: 3,
    imageUrl: "https://source.unsplash.com/random",
    relatedProducts: ["1", "2"],
  },
];
const productList = [
    { id: "1", imageUrl: "https://source.unsplash.com/random/?productshot", description: "Description for Product 1" },
    { id: "2", imageUrl: "https://source.unsplash.com/random/?tshirts", description: "Description for Product 2" },
    { id: "3", imageUrl: "https://source.unsplash.com/random/?hat", description: "Description for Product 2" },
    // Add more products as needed
  ];

//Flexbox container for gallery
const container = document.getElementById("gallery");

//Flexbox container for related products
const details = document.getElementById("details");

// Function to update the padding of the last child allowing the last gallery item to reach
//  the scroll point and not have leftover space in overflow

// NOTE: we use lastChild.width because offsetWidth includes padding which could work initially on page load
// but when a user resizes and the function runs again, it wouldnt be acurate.

// TODO: Make sure to not allow padding to go below 0

function updateLastChildPadding() {
  const lastChild = container.children[container.children.length - 1];
  if (lastChild && lastChild.width < container.getBoundingClientRect().width) {
    lastChild.style.paddingRight = `${
      container.getBoundingClientRect().width - lastChild.width
    }px`;
  }else{
    lastChild.style.paddingRight = "0px";
  }
}

// Set gallery content based on JSON list, currently only accounting for images
imageList.forEach((data, index) => {
  const img = document.createElement("img");
  img.src = data.imageUrl;
  img.alt = "Image";
  img.className = "image";
  img.addEventListener("click", () => displayDetails(data));
  container.appendChild(img);

  if (index === imageList.length - 1) {
    // calls the lastChild padding function as the last photo is loaded
    // otherwise the padding would equal to the container size as lastChild width could potentially be 0
    img.addEventListener("load", updateLastChildPadding);
  }
});

// Function to grab the relatedProducts of the associated gallery item from the JSON list
function updateDetailsContent(index) {
    const data = imageList[index];
  
    // Clear existing content in the details element
    details.innerHTML = "";
  
    // Fetch product details based on product IDs in relatedProducts array
    data.relatedProducts.forEach((productId, index) => {
      const product = productList.find((p) => p.id === productId);
      if (product) {
        const div = document.createElement("div");
        div.innerHTML = `
          <img src="${product.imageUrl}" alt="Product Image">
          <h2>${product.description}</h2>
        `;
        // Custom css property to stagger related products into a grid.
        // We +1 so the first item != 0
        div.style = `--animation-order:${index + 1}`;
        details.appendChild(div);
      }
    });
  }

document.addEventListener("DOMContentLoaded", function () {
  const activeClass = "active";
  const inactiveClass = "inactive";
  let currentIndex = 0;
  let isScrolling;

  // function to debounce the scroll event so we arent calling functions excessively
  function debounce(callback, delay) {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(function () {
      callback();
    }, delay);
  }

  // Set initial classes for all images
  const images = Array.from(container.children);

  images.forEach((image, i) => {
    image.classList.add(i === 0 ? activeClass : inactiveClass);
  });

  // Update the padding initially
  updateLastChildPadding();
// Set initial details content for index 0
    updateDetailsContent(0);

// Track previous Index
let previousIndex = -1;

// Add the debounced scroll event listener
container.addEventListener("scroll", function () {
  debounce(function () {
    const containerWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;

    let cumulativeWidth = 0;
    let index = 0;

    // Find the current index based on cumulative widths
    images.some((image, i) => {
      cumulativeWidth += image.offsetWidth;

      if (cumulativeWidth >= scrollLeft) {
        index = i;
        return true;
      }
      return false;
    });

    if (index !== previousIndex) {
      // Only update and perform actions if currentIndex has changed
      currentIndex = index;
      console.log("Current Index:", currentIndex);

      updateDetailsContent(currentIndex);

      // Update classes for all images
      images.forEach((image, i) => {
        image.classList.toggle(activeClass, i === currentIndex);
        image.classList.toggle(inactiveClass, i !== currentIndex);
      });

      // Additional logic based on the currentIndex can be added here

      // Update previousIndex to the current value
      previousIndex = currentIndex;
    }
  }, 40); // Adjust the debounce delay as needed
});

  // Update last child padding on window resize
  window.addEventListener("resize", updateLastChildPadding);
});
