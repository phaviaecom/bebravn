$(document).ready(() => {
	if(window.location.href.includes("/collections")){

		if( $('.list-variants .swatch-item').length > 0 ){

			$('.list-variants .swatch-item').each( (idx, el) => {
				$(el).find('a').on('click', (e) => {
					console.log(e.currentTarget);
					let productId  = e.currentTarget.dataset.id;
					let featureImg = e.currentTarget.dataset.featured;
					let secondImg  = e.currentTarget.dataset.second;
					let handleProduct = e.currentTarget.dataset.handle;

					$(`#list_variants-${productId } .swatch-item`).removeClass('is-selected');
					$(e.currentTarget.parentNode).addClass('is-selected');

                	// Change the attributes of the image
					$(`#feature-img-${productId}`).attr('srcset', `${featureImg}`);
					$(`#feature-img-${productId}`).attr('data-srcset', `${featureImg}`);
					$(`#second-img-${productId}`).attr('srcset', `${secondImg}`);
					$(`#second-img-${productId}`).attr('data-srcset', `${secondImg}`);
					$(`.product-link-${productId}`).attr('href', `/products/${handleProduct}`);
				})
			})
		}

	}
})