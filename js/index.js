/*LOADING*/
let loadRender = (function () {
    let $loadingBox = $('.loadingBox'),
        $current = $loadingBox.find('.current');
    let imgData = ["img/icon.png","img/JSinterview.jpg","img/treesmall.png","img/zf_concatAddress.png","img/zf_concatPhone.png","img/zf_course.png","img/zf_course1.png","img/zf_course2.png","img/zf_course3.png","img/zf_course4.png","img/zf_course5.png","img/zf_course6.png","img/zf_cube1.png","img/zf_cube2.png","img/zf_cube3.png","img/zf_cube4.png","img/zf_cube5.png","img/zf_cube6.png","img/zf_cubeBg.jpg","img/zf_cubeTip.png","img/zf_messageArrow1.png","img/zf_messageArrow2.png","img/zf_messageChat.png","img/zf_messageKeyboard.png","img/zf_messageLogo.png","img/zf_messageStudent.png","img/zf_outline.png","img/zf_phoneBg.jpg","img/zf_phoneDetail.png","img/zf_phoneListen.png","img/zf_phoneLogo.png","img/zf_return.png","img/zf_styleTip1.png","img/zf_styleTip2.png","img/zf_teacherTip.png"];
    let n = 0, len = imgData.length;
    let delayTimer = null;
    let run = function run(callback) {
        imgData.forEach(item => {
            let tempImg = new Image;
            tempImg.onload = () => {
                tempImg = null;
                $current.css('width', n++/len * 100 + '%');
                if (n==len) {
                    clearTimeout(delayTimer);
                    $current.css('width', '100%');
                    callback && callback();
                }
            };

            tempImg.src = item;
        })
    };
    /*设置最长等待时间*/
    let maxDelay = function (callback) {
        delayTimer = setTimeout(() => {
            clearTimeout(delayTimer);
            if (n / len >= 0.9) {
                $current.css('width', '100%');
                callback && callback();
                return;
            }
            alert('非常遗憾，当前网速不佳，请稍后再试')
        }, 3000)
    };
    //完成
    let done = function done() {
        let timer=setTimeout(()=>{
            phoneRender.init();
            clearTimeout(timer);
            $loadingBox.remove();
        },700)
        };
    return {
        init: function () {
            $loadingBox.css('display', 'block');
            run(done);
            maxDelay(done);
        }
    }
})();
/*PHONE渲染*/
let phoneRender = (function () {
    let $phoneBox=$('.phoneBox'),
        $answer=$phoneBox.find('.answer'),
        answerBell=$('#answerBell')[0],
        introduction=$('#introduction')[0],
        $hang=$phoneBox.find('.hang'),
        $answerMarkLink=$answer.find('.markLink'),
        $hangMarkLink=$hang.find('.markLink'),
        $time=$phoneBox.find('span');

    console.log(answerBell);
    /*CLICK ANSWER-MARK*/
    let answerMarkTouch=function () {
        //ANSWER
        $answer.remove();
        answerBell.pause();
        $(answerBell).remove();
        //2.HANG
        $hang.css('transform','translateY(0rem)');
        $time.css('display','block');
        introduction.play();
        computedTime();
    };
    //COMPUTED TIME
    let autoTime=null;
    let computedTime=function computedTime() {
        autoTime=setInterval(()=>{
            let val=introduction.currentTime,
                duration=introduction.duration;
            console.log(duration);
            if(val>=duration){
                clearInterval(autoTime);
                return;
            }
            let minute=Math.floor(val/60),
                second=Math.floor(val-minute*60);
            minute=minute<10?'0'+minute:minute;
            second=second<10?'0'+second:second;
            $time.html(`${minute}:${second}`)
        },1000)
    };
    //HANG-OFF PHONE
    let closePhone=function () {
        clearInterval(autoTime);
        introduction.pause();
        $(introduction).remove();
        console.log(1);
        $phoneBox.remove();
    };
    return {
        init: function () {
            $phoneBox.css('display', 'block');
            answerBell.play();
            answerBell.volume=0.3;
            $answerMarkLink.tap(answerMarkTouch);
            $hangMarkLink.tap(closePhone);
        }
    }
})();
/*MESSAGE RENDER*/
let messageRender = (function () {
      let $messageBox=$('.messageBox');
    return {
        init: function () {
              $messageBox.css('display','block')
        }
    }
})();
messageRender.init();
/*HASH*/
let url=window.location.href,
    well=url.indexOf('#'),
    hash=well===-1?null:url.substr(well+1);
switch(hash){
    case 'loading':
        loadRender.init();
        break;
    case 'phone':
        phoneRender.init();
        break;
    case 'message':
        messageRender.init();
        break;
    default:
        loadRender.init();
}