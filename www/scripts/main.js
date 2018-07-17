//@prepros-prepend slider.js

var app = {
	initFunction: function() {
		var formInput = $('.form__item input, .form__item select');
		var toggleLabel = function(element) {
			if (element.val()) {
				element.addClass('is-filled');
			} else {
				element.removeClass('is-filled');
			}
		}

		formInput.each(function() {
			toggleLabel($(this));
		});

		formInput.on('blur', function() {
			toggleLabel($(this));
		});
	},
	initSpacing: function() {
		var heading = $('.heading');
		if (heading.length){
			var headingHeight = $('.heading').height() + 60;
			var section = $('.start-bottom');
			section.css('paddingTop', headingHeight+'px');
		}
	},
	initScrollDetection: function() {
		if ($(document).height() > $(window).height()) {
			$('body').addClass('has-scroll');
		} else {
			$('body').removeClass('has-scroll');
		}
	},
	initDialogPositioning: function() {
		var dialog = $('.dialog__box');
		var dialogHeight = dialog.height();
		var dialogMargin = dialogHeight / 2;

		dialog.css('margin-top', -dialogMargin+'px');
	},
	initPinInput: function() {
		$('.pin__input input').keyup(function () {
			if (this.value.length == this.maxLength) {
				$(this).next('input').focus();
			}
		});
	},
	initImageHeight: function() {
		var imgHeight = $('.playlist__col--img img').height();
			$('.playlist__col--txt').height(imgHeight);
	},
	initSliders: function() {
		$('.offers__list').slick({
			centerMode: true,
			centerPadding: '30px',
			slidesToShow: 1,
			infinite: false,
			arrows: false,
		});

		$('.lifestyle__list').slick({
			slidesToShow: 3,
			slidesToScroll: 3,
			infinite: false,
			arrows: false,
		});

		$('.account__details').slick({
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			dots: true
		});
	},
	initMenuTrigger: function() {
		$('.navbar__action--menu, .navbar__action--close').on('click', function(event) {
			event.preventDefault();
			$('nav').fadeToggle(400);
			$('body').toggleClass('menu-open');
			$('.navbar__action--menu').toggleClass('navbar__action--is-hidden');
			$('.navbar__action--close').toggleClass('navbar__action--is-hidden');
		});
	}
};

$(function() {
	app.initFunction();
	app.initSpacing();
	app.initDialogPositioning();
	app.initScrollDetection();
	app.initPinInput();
	app.initImageHeight();
	app.initSliders();
	app.initMenuTrigger();
	$(window).resize(function() {
		app.initScrollDetection();
		app.initDialogPositioning();
		app.initImageHeight();
	});
	$(document).on('change', '.heading', function() {
		app.initSpacing();
	});
});
