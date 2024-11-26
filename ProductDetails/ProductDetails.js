const productId = new URLSearchParams(window.location.search).get("id");
const getProductsDetails = async (productId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/products/${productId}`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    console.log(data);
    document.getElementById("product-name").textContent = data.product.title;
    document.getElementById("product-price").textContent = `${parseFloat(
      data.product.price
    ).toFixed(2)}${data.product.currency}`;
    document.getElementById("product-description").textContent =
      data.product.description;
    data.product.stock > 0
      ? (document.getElementById("product-stock").style.display = "block")
      : (document.getElementById("product-soldout").style.display = "block");
    getProductImages(data);
  } catch (error) {
    console.error("Xeta bas verdi:", error);
  }
};
getProductsDetails(productId);
const getProductImages = async (data) => {
    try {
        const images =data.product.gallery;
        // Şəkil mənbələri scrool yoxlamaqa
    //   const images =[
    //     "https://m.media-amazon.com/images/I/91ALSMEjQCL._AC_SX679_.jpg",
    //     "https://m.media-amazon.com/images/I/91ALSMEjQCL._AC_SX679_.jpg",
    //     "https://m.media-amazon.com/images/I/91ALSMEjQCL._AC_SX679_.jpg",
    //     "https://m.media-amazon.com/images/I/91ALSMEjQCL._AC_SX679_.jpg",
    //     "https://m.media-amazon.com/images/I/91ALSMEjQCL._AC_SX679_.jpg",
    //     "https://m.media-amazon.com/images/I/91ALSMEjQCL._AC_SX679_.jpg",
    //   ];
  
      let count = images.length;
  
      
      document.getElementById("mainimg").src = images[0];
  
     
      const imagesContainer = document.getElementById("imagescontainer");
  
      
      imagesContainer.classList.add(
        "flex",
        "flex-col",
        "gap-4",
        "overflow-y-auto",  
        "p-4",
        "border",
        "rounded-lg",
        "max-h-[500px]"  
      );
  
 
      images.forEach((img) => {
        const div1 = document.createElement("div");
        div1.classList.add(
           
          "relative",
          "flex",
          "items-center",
          "overflow-hidden",
          "bg-gray-200",
          "rounded-lg",
          "min-h-28",
          "min-w-16",
          "max-w-32",
          "max-h-64",
          
        );
  
        const image = document.createElement("img");
        image.classList.add(
          "w-full",  
          "h-full", 
          "object-contain",  //lazim olsa deyisek cover edek
          "rounded-md",
          "max-w-[119px]",
          "max-h-[119px]"
        );
  
        
        image.src = img;
        image.addEventListener("click",()=>{
            document.getElementById("mainimg").src=img
        })
        div1.appendChild(image);
        imagesContainer.appendChild(div1);
      });
  
     
      if (count > 4) {
        imagesContainer.style.overflowY = "scroll"; // Scroll-u aktivləşdir
        
      } else {
        imagesContainer.style.overflowY = "hidden"; // Scroll-u deaktiv et
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  
 
  
