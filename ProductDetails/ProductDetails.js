const productId = new URLSearchParams(window.location.search).get("id"); //bu ela

const getProductImages = async function (data) {
  try {
    const images = data.product.gallery;
    // Şəkil mənbələri scrool yoxlamaqa
    // const images =[
    //     "https://m.media-amazon.com/images/I/91ALSMEjQCL._AC_SX679_.jpg",
    //     "https://m.media-amazon.com/images/I/91ALSMEjQCL._AC_SX679_.jpg",
    //     "https://m.media-amazon.com/images/I/91ALSMEjQCL._AC_SX679_.jpg",
    //     "https://m.media-amazon.com/images/I/91ALSMEjQCL._AC_SX679_.jpg"

    //   ];

    let count = images.length;

    document.getElementById("mainimg").src = images[0];

    const imagesContainer = document.getElementById("imagescontainer");

    images.forEach((img) => {
      const div1 = document.createElement("div");
      div1.classList.add(
        "relative",
        "flex",
        "items-center",
        "border",
        "overflow-hidden",
        "rounded-lg",
        "min-h-28",
        "min-w-16",
        "max-w-32",
        "max-h-64"
      );

      const image = document.createElement("img");
      image.classList.add(
        "w-full",
        "h-full",
        "object-contain", //lazim olsa deyisek cover edek
        "rounded-md",
        "max-w-[119px]",
        "max-h-[119px]"
      );

      image.src = img;
      image.addEventListener("click", () => {
        document.getElementById("mainimg").src = img;
      });
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

const getRelatedProduct = async function (data) {
  try {
    const relatedItems = document.getElementById("related-items");
    const category = data.product.category;
    console.log("Selected Category:", category);

    const response = await fetch(
      `http://localhost:3000/api/products?pageSize=4&category=${category}`
    );
    console.log("API Response:", response);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const productsObj = await response.json();
    console.log("Products Data:", productsObj);
    let products;
    if (!Array.isArray(productsObj)) {
      products = productsObj.products;
      console.log("Related product", products);
    }

    products.map((item) => {
      const relatedDivItem = document.createElement("div");
      relatedDivItem.classList.add(
        "w-[270px]",
        "h-[322px]",
        "flex",
        "flex-col",
        "gap-[8px]",
        "relative",
        "group"
      );

      // Şəkil divi yaratmaq
      const relatedDivItemImg = document.createElement("div");
      relatedDivItemImg.classList.add(
        "h-[250px]",
        "w-[270px]",
        "p-4",
        "flex",
        "items-center",
        "justify-center",
        "rounded-md",
        "bg-gray-100",
        "relative",
        "overflow-hidden",
        "group"
      );

      // Şəkil elementi yaratmaq
      const imageRelated = document.createElement("img");
      imageRelated.id = "image-related"; // Unikal ID təyin edin
      imageRelated.classList.add("w-[190px]", "h-[180px]", "object-contain");
      imageRelated.alt = item.title;
      imageRelated.src = item.gallery[0]; // Şəkil yolu

      // Hover effekt divi yaratmaq
      const hoverEffectDiv = document.createElement("div");
      hoverEffectDiv.classList.add(
        "absolute",
        "inset-x-0",
        "bottom-[-10px]",
        "bg-[#000000]",
        "bg-opacity-75",
        "opacity-0",
        "flex",
        "items-center",
        "justify-center",
        "translate-y-0",
        "group-hover:translate-y-[-10px]",
        "group-hover:opacity-0",
        "group-hover:opacity-100",
        "group-hover:transition-all",
        "group-hover:duration-300"
      );

      // Add to basket düyməsini yaratmaq
      const addButton = document.createElement("button");
      addButton.classList.add(
        "font-poppins",
        "font-medium",
        "text-[16px]",
        "leading-[24px]",
        "text-[#FFFFFF]",
        "bg-transparent",
        "w-[115px]",
        "h-[48px]",
        "rounded-md",
        "text-center"
      );
      addButton.textContent = "Add To Basket";

      // Hover effekti divinə düyməni əlavə etmək
      hoverEffectDiv.appendChild(addButton);

      // Şəkil divinə şəkili və hover effekti əlavə etmək
      relatedDivItemImg.appendChild(imageRelated);
      relatedDivItemImg.appendChild(hoverEffectDiv);

      // Məhsul adı və qiymətini əlavə etmək
      const relatedDivItemInfo = document.createElement("div");
      relatedDivItemInfo.classList.add(
        "w-[201px]",
        "h-[56px]",
        "flex",
        "flex-col",
        "gap-[8px]"
      );

      const productTitle = document.createElement("h3");
      productTitle.classList.add(
        "font-poppins",
        "font-medium",
        "text-[16px]",
        "leading-[24px]",
        "text-[#000000]"
      );
      productTitle.textContent = item.title;

      const productPrice = document.createElement("p");
      productPrice.classList.add(
        "font-poppins",
        "font-medium",
        "text-[16px]",
        "leading-[24px]",
        "text-[#DB4444]"
      );
      productPrice.textContent = `${parseFloat(item.price).toFixed(2)}${
        item.currency
      }`;

      relatedDivItemInfo.addEventListener("click", () => {
        window.location.href = `http://127.0.0.1:5500/ProductDetails/ProductDetails.html?id=${item._id}`;
      });


      //burda her bir elemente hansiki asagda gorsenir onlaara biz geereu add asketi elave edek
      //onda deemeli malin id si gedmelidi , say da bir dene

      relatedDivItemInfo.appendChild(productTitle);
      relatedDivItemInfo.appendChild(productPrice);

     
      relatedDivItem.appendChild(relatedDivItemImg);
      relatedDivItem.appendChild(relatedDivItemInfo);

     
      relatedItems.appendChild(relatedDivItem);
    });
  } catch (error) {
    console.error(`Error in GetRelatedProduct: ${error}`);
  }
};

const getProductsDetails = async (productId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/products/${productId}`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();

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
    getRelatedProduct(data);
    clickCount(data);
  } catch (error) {
    console.error("Xeta bas verdi:", error);
  }
};

getProductsDetails(productId);

const clickCount = async (data) => {
  const prdouctcount = document.getElementById("prdouct-count");
  let value = parseInt(prdouctcount.value);
  let stockcount = data.product.stock;
  const product = data.product;
  console.log(product);
  const minusbutton = document.getElementById("minusbutton");
  const pilusbutton = document.getElementById("pilusbutton");
 minusbutton.addEventListener("click", () => {
    if (stockcount > 0) {
      if (value > 1) {
        value -= 1;
        prdouctcount.value = value;
      } else {
        alert("Minimum count is 1");
      }
    }
  });

  pilusbutton.addEventListener("click", () => {
    if (stockcount > 0) {
      if (value < stockcount) {
        value = value + 1;
        prdouctcount.value = value;
      } else {
        alert(`Maximum  count is ${stockcount}`);
      }
    }
  });

  //token lazim
  // let addBasketButton = document.getElementById("addToBasket");
  // addBasketButton.addEventListener("click",async()=>{
  //   const response2 = await fetch(`http://localhost:3000/api/baskets/add${product._id}`,{
  //    method:"POST",
  //    headers:{
  //     "Accept":"application/json",
  //     "Content-Type":"application/json",
  //     "Authorization": `Bearer ${accessToken}`
  //    },
  //    body:JSON.stringify({
  //     productId:product._id,
  //     quantity:value
  //    })
  //   });

  //   if (!response2.ok) throw new Error(`HTTP error! Status: ${response2.status}`);
  //   const data2 =await response2.json();

  //   //http://localhost:3000/api/baskets/add
  //   // if(stockcount)
  //   //burda da id gedecek birde value hansiki sayidir plus o pul
  // })
};
