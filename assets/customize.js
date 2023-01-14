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

	//Change the variant
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
		
		// if($("div[data-product-thumbs] .product__thumb-item").length > 0) {
		// 	$("div[data-product-thumbs] .product__thumb-item").each(( idx, el )=>{
		// 		$(el).on('click', (e) => {
		// 			if($('.product__main-photos .is-selected .js-photoswipe__zoom')){
		// 				$('.product__main-photos .is-selected').find('.js-photoswipe__zoom').trigger("click");
		// 			}
		// 		});
		// 	});
		// }
		// if($('.product__main-photo img')){
		// 	$('.product__main-photo img').on('click', (e) => {
		// 		if($('.product__thumb-item.product__thumb-item-featured').length != 0){
		// 			$('.product__thumb-item.product__thumb-item-featured').trigger('click');
		// 		}else{
		// 			$('.product__main-photos .is-selected').find('.js-photoswipe__zoom').trigger("click");
		// 		}
		// 	})
		// }
		
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
	 if(window.location.href.includes('/pages/returns')){
		$('#retouren-portal').on('load', (e) => {
		   autoResize(e.target);
		})
		function autoResize(iframe) {
		   $(iframe).height($(iframe).contents().find('html').height());
	   }
	}
	
	// Handle zoom Image
	function isZooming(){
		return $(window).height();
	}

	if(!window.location.href.includes('/products/')){
		document.addEventListener('quickview:loaded', function (evt) {

			let quickView = evt.target.activeElement;
			let id = quickView.getAttribute('data-product-id');
			let idSlider = `QuickShopModal-Gallery-${id}`;

			$('#QuickShopModal-Gallery-Zoom .quick-view-main-carousel').html($(`#${idSlider}`).html());
		
			let i = 0; // current slide
			let j = $('#QuickShopModal-Gallery-Zoom .quick-view-main-carousel .carousel-cell').length; // total slides
		
			quickView.querySelectorAll(".product__modal-opener .product__media img").forEach( (elm) => {
				elm.addEventListener('click', (e) => {
					document.querySelectorAll(`#QuickShopModal-Gallery-Zoom .carousel-cell`).forEach((elm) => {
						elm.dataset.position == e.target.dataset.position ? elm.classList.add('active') : elm.classList.remove('active');
						let ratio = isZooming();
						elm.querySelector('img').style.height = ratio + 'px';
						elm.querySelector('img').style.width = ratio + 'px';
					});
					i = parseInt(e.target.dataset.position) == 1 ? 0 : parseInt(elm.dataset.position) - 1;
					document.getElementById('QuickShopModal-Gallery-Zoom').classList.contains('hide') ? document.getElementById('QuickShopModal-Gallery-Zoom').classList.remove('hide') : '';
				    document.getElementById('overlay-background').classList.contains('hide') ? document.getElementById('overlay-background').classList.remove('hide') : '';
					document.getElementById('overlay-background').style.backgroundColor = '#FFFFFF';
				})
			});
			$('#QuickShopModal-Gallery-Zoom .pswp__button--close').on('click', (e) => {
				!document.getElementById('QuickShopModal-Gallery-Zoom').classList.contains('hide') ? document.getElementById('QuickShopModal-Gallery-Zoom').classList.add('hide') : '';
				!document.getElementById('overlay-background').classList.contains('hide') ? document.getElementById('overlay-background').classList.add('hide') : '';
				 document.getElementById('overlay-background').style.backgroundColor = '#000000a6';
			})

			$('#QuickShopModal-Gallery-Zoom .pswp__button--arrow--left').on('click', (e) => {
				document.querySelector(`#QuickShopModal-Gallery-Zoom .carousel-cell[data-position="${i + 1}"]`)?.classList.remove('active');
				i = parseInt((j + i - 1)%j);
				document.querySelector(`#QuickShopModal-Gallery-Zoom .carousel-cell[data-position="${i + 1}"]`)?.classList.add('active');
			})
			$('#QuickShopModal-Gallery-Zoom .pswp__button--arrow--right').on('click', (e) => {
				document.querySelector(`#QuickShopModal-Gallery-Zoom .carousel-cell[data-position="${i + 1}"]`)?.classList.remove('active');
				i = parseInt((j + i + 1)%j);
				document.querySelector(`#QuickShopModal-Gallery-Zoom .carousel-cell[data-position="${i + 1}"]`)?.classList.add('active');
			})
		})
	}
})
