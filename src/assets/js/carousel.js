$('#carouselExample2').on('slide.bs.carousel', function (e) {


  var $e = $(e.relatedTarget);
  var idx = $e.index();
  var itemsPerSlide = 4;
  var totalItems = $('.carousel-item2').length;

  if (idx >= totalItems - (itemsPerSlide - 1)) {
    var it = itemsPerSlide - (totalItems - idx);
    for (var i = 0; i < it; i++) {
      // append slides to end
      if (e.direction == "left") {
        $('.carousel-item2').eq(i).appendTo('.carousel-inner2');
      } else {
        $('.carousel-item2').eq(0).appendTo('.carousel-inner2');
      }
    }
  }
});


$('#carouselExample2').carousel({
  interval: 2000
});


$(document).ready(function () {
  /* show lightbox when clicking a thumbnail */
  $('a.thumb').click(function (event) {
    event.preventDefault();
    var content = $('.modal-body');
    content.empty();
    var title = $(this).attr("title");
    $('.modal-title').html(title);
    content.html($(this).html());
    $(".modal-profile").modal({
      show: true
    });
  });

});
