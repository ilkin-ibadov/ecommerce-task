const productId = new URLSearchParams(window.location.search).get("id")
const getProductsDetails=async (productId)=>
{
    try {
        const response=await fetch(`http://localhost:3000/api/products/${productId}`);
        if(!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
        const data=await response.json();
        console.log(data);

        document.getElementById('product-name').textContent=data.product.title;
        document.getElementById('product-price').textContent=`${parseFloat(data.product.price).toFixed(2)}${data.product.currency}`
        document.getElementById('product-description').textContent=data.product.description;
        if(data.product.stock>0)
            
    } catch (error) {
        console.error('Xeta bas verdi:',error);
    }
}
getProductsDetails(productId);







