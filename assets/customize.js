$(document).ready(() => {

    let setVariants = () => {
		if( $('.list-variants .swatch-item').length > 0 ){
			$('.list-variants .swatch-item').each( (idx, el) => {
				$(el).find('a').on('click', (e) => {
					let productId  = e.currentTarget.dataset.id;
					let featureImg = e.currentTarget.dataset.featured;
					let secondImg  = e.currentTarget.dataset.second;
					let handleProduct = e.currentTarget.dataset.handle;
					let parentNode = $(e.currentTarget).parent().parent().parent().parent();

					$(parentNode).find('.list-variants .swatch-item').removeClass('is-selected');
					$(e.currentTarget.parentNode).addClass('is-selected');

					// Change the attributes of the image
					$(parentNode).find('.featured-image').attr('srcset', `${featureImg}`);
					$(parentNode).find('.featured-image').attr('data-srcset', `${featureImg}`);

					$(parentNode).find('.secondary-image').attr('srcset', `${secondImg}`);
					$(parentNode).find('.secondary-image').attr('data-srcset', `${secondImg}`);

					$(parentNode).find('.grid-product__link').attr('href', `/products/${handleProduct}`);
				})
			})
		}
	}

	if(window.location.href.includes("/products")){
		let setTime = setInterval(() => {
			$('.list-variants .swatch-item').each( (idx, el) => {
					$(el).find('a').on('click', (e) => {
		
						let productId  = e.currentTarget.dataset.id;
						let featureImg = e.currentTarget.dataset.featured;
						let secondImg  = e.currentTarget.dataset.second;
						let handleProduct = e.currentTarget.dataset.handle;
						let parentNode = $(e.currentTarget).parent().parent().parent().parent();
	
						$(parentNode).find('.list-variants .swatch-item').removeClass('is-selected');
						$(e.currentTarget.parentNode).addClass('is-selected');
	
						// Change the attributes of the image
						$(parentNode).find('.featured-image').attr('srcset', `${featureImg}`);
						$(parentNode).find('.featured-image').attr('data-srcset', `${featureImg}`);
	
						$(parentNode).find('.secondary-image').attr('srcset', `${secondImg}`);
						$(parentNode).find('.secondary-image').attr('data-srcset', `${secondImg}`);
	
						$(parentNode).find('.grid-product__link').attr('href', `/products/${handleProduct}`);
					})
				})
		}, 1000);

		setTimeout(function () {
			clearInterval(setTime);
		}, 6000);

	 }else if( window.location.href.includes("/collections")){
		let setTime = setInterval(() => {
			$('.list-variants .swatch-item').each( (idx, el) => {
					$(el).find('a').on('click', (e) => {
						
						let productId  = e.currentTarget.dataset.id;
						let featureImg = e.currentTarget.dataset.featured;
						let secondImg  = e.currentTarget.dataset.second;
						let handleProduct = e.currentTarget.dataset.handle;
						let parentNode = $(e.currentTarget).parent().parent().parent().parent();
	
						$(parentNode).find('.list-variants .swatch-item').removeClass('is-selected');
						$(e.currentTarget.parentNode).addClass('is-selected');
	
						// Change the attributes of the image
						$(parentNode).find('.featured-image').attr('srcset', `${featureImg}`);
						$(parentNode).find('.featured-image').attr('data-srcset', `${featureImg}`);
	
						$(parentNode).find('.secondary-image').attr('srcset', `${secondImg}`);
						$(parentNode).find('.secondary-image').attr('data-srcset', `${secondImg}`);
	
						$(parentNode).find('.grid-product__link').attr('href', `/products/${handleProduct}`);
					})
				})
		}, 1500);
	 }
	 else{

		setVariants();
	 }

})
