$(document).ready(function(){
    //Check to see if the window is top if not then display button
    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });

    //Click event to scroll to top
    $(".scrollToTop").click(function(){
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });
    $('a[href^=#]').on("click",function(){
        var t= $(this.hash);
        var t=t.length&&t||$('[name='+this.hash.slice(1)+']');
        if(t.length){
            var tOffset=t.offset().top;
            $('html,body').animate({scrollTop:tOffset-20},'slow');
            return false;
        }
    });
});
