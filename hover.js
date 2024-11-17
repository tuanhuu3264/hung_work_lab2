$(document).ready(function () {
  $(".top-rating-movie-item").hover(
    function () {
      $(this).find(".movie-info-popup").fadeIn(200);
    },
    function () {
      $(this).find(".movie-info-popup").fadeOut(200);
    }
  );
});
