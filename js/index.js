/*LOADING*/
let loadRender = (function () {
    let $loadingBox = $('.loadingBox'),
        $current = $loadingBox.find('.current');
    let imgData = ["img/icon.png", "img/JSinterview.jpg", "img/treesmall.png", "img/zf_concatAddress.png", "img/zf_concatPhone.png", "img/zf_course.png", "img/zf_course1.png", "img/zf_course2.png", "img/zf_course3.png", "img/zf_course4.png", "img/zf_course5.png", "img/zf_course6.png", "img/zf_cube1.png", "img/zf_cube2.png", "img/zf_cube3.png", "img/zf_cube4.png", "img/zf_cube5.png", "img/zf_cube6.png", "img/zf_cubeBg.jpg", "img/zf_cubeTip.png", "img/zf_messageArrow1.png", "img/zf_messageArrow2.png", "img/zf_messageChat.png", "img/zf_messageKeyboard.png", "img/zf_messageLogo.png", "img/zf_messageStudent.png", "img/zf_outline.png", "img/zf_phoneBg.jpg", "img/zf_phoneDetail.png", "img/zf_phoneListen.png", "img/zf_phoneLogo.png", "img/zf_return.png", "img/zf_styleTip1.png", "img/zf_styleTip2.png", "img/zf_teacherTip.png"];
    let n = 0, len = imgData.length;
    let delayTimer = null;
    let run = function run(callback) {
        imgData.forEach(item => {
            let tempImg = new Image;
            tempImg.onload = () => {
                tempImg = null;
                $current.css('width', n++ / len * 100 + '%');
                if (n == len) {
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
        let timer = setTimeout(() => {
            phoneRender.init();
            clearTimeout(timer);
            $loadingBox.remove();
        }, 700)
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
    let $phoneBox = $('.phoneBox'),
        $answer = $phoneBox.find('.answer'),
        answerBell = $('#answerBell')[0],
        introduction = $('#introduction')[0],
        $hang = $phoneBox.find('.hang'),
        $answerMarkLink = $answer.find('.markLink'),
        $hangMarkLink = $hang.find('.markLink'),
        $time = $phoneBox.find('span');

    console.log(answerBell);
    /*CLICK ANSWER-MARK*/
    let answerMarkTouch = function () {
        //ANSWER
        $answer.remove();
        answerBell.pause();
        $(answerBell).remove();
        //2.HANG
        $hang.css('transform', 'translateY(0rem)');
        $time.css('display', 'block');
        introduction.play();
        computedTime();
    };
    //COMPUTED TIME
    let autoTime = null;
    let computedTime = function computedTime() {
        autoTime = setInterval(() => {
            let val = introduction.currentTime,
                duration = introduction.duration;
            console.log(duration);
            if (val >= duration) {
                clearInterval(autoTime);
                return;
            }
            let minute = Math.floor(val / 60),
                second = Math.floor(val - minute * 60);
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;
            $time.html(`${minute}:${second}`)
        }, 1000)
    };
    //HANG-OFF PHONE
    let closePhone = function () {
        clearInterval(autoTime);
        introduction.pause();
        $(introduction).remove();
        $phoneBox.remove();
        messageRender.init();
    };
    return {
        init: function () {
            $phoneBox.css('display', 'block');
            answerBell.play();
            answerBell.volume = 0.3;
            $answerMarkLink.tap(answerMarkTouch);
            $hangMarkLink.tap(closePhone);
        }
    }
})();
/*MESSAGE RENDER*/
let messageRender = (function () {
    let $messageBox = $('.messageBox'),
        $wrapper = $messageBox.find('.wrapper'),
        $messageList = $wrapper.find('li'),
        $keyBoard = $messageBox.find('.keyBoard'),
        $submit = $keyBoard.find('.submit'),
        demonMusic = $keyBoard.find('#demonMusic')[0],
        $textInp = $keyBoard.find('span');
    let step = -1,
        total = $messageList.length + 1,
        autoTimer = null,
        interval = 1500,
        tt = 0;
    let showMessage = function () {
        ++step;
        let $cur = $messageList.eq(step);
        $cur.addClass('active');
        if (step == 0) {
            let autoTimerA=setTimeout(()=>{
                clearTimeout(autoTimerA);
                handleSend()},1000);
            clearInterval(autoTimer);
        }
        if (step >= total - 1) {
            clearInterval(autoTimer);
            let autoClose = setTimeout(() => {
                closeMessage();
                clearTimeout(autoClose)
            }, 3000);
        }
        if (step >= 2) {
            let curH = $cur[0].offsetHeight;
            tt -= curH;
            $wrapper.css('transform', `translateY(${tt}px)`)
        }
    };
    let handleSubmit = function handleSubmit() {
        $(`<li class="interView">
           <i class="arrow"></i><img src="img/JSinterview.jpg" alt="" class="pic">
            ${$textInp.html()}
        </li>`).insertAfter($messageList.eq(step)).addClass('active');
        $messageList = $wrapper.find('li');
        $textInp.html('');
        $submit.css('display', 'none');
        $keyBoard.css({transform: 'translateY(3.7rem)'});
        showMessage();
        autoTimer = setInterval(showMessage, interval);
    };
    let handleSend = function () {
        $keyBoard.css('transform', 'translateY(0)').one('transitionend', () => {
            let str = '您好，请介绍一下，你的技术',
                n = -1,
                textTime = setInterval(() => {
                    let textHTML = $textInp.html();
                    $textInp.html(textHTML + str[++n]);
                    if (n >= str.length - 1) {
                        clearInterval(textTime);
                        $submit.css('display', 'block');
                    }
                }, 100)
        })
    };
    let closeMessage = function () {
        demonMusic.pause();
        $(demonMusic).remove();
        $messageBox.remove();
    };
    return {
        init: function () {
            $messageBox.css('display', 'block');
            demonMusic.play();
            demonMusic.volume = 0.3;
            autoTimer = setInterval(showMessage, interval);
            $submit.tap(handleSubmit);

        }
    }
})();
let cubeRender = (function () {
    let $cubeBox = $('.cubeBox'),
        $cube = $('.cube'),
        $cubeList = $cube.find('li');

    //=>手指控住旋转
    let start = function start(ev) {
        //=>记录手指按在位置的起始坐标
        let point = ev.changedTouches[0];
        this.strX = point.clientX;
        this.strY = point.clientY;
        this.changeX = 0;
        this.changeY = 0;
    };
    let move = function move(ev) {
        //=>用最新手指的位置-起始的位置，记录X/Y轴的偏移
        let point = ev.changedTouches[0];
        this.changeX = point.clientX - this.strX;
        this.changeY = point.clientY - this.strY;
    };
    let end = function end(ev) {
        //=>获取CHANGE/ROTATE值
        let {changeX, changeY, rotateX, rotateY} = this,
            isMove = false;
        //=>验证是否发生移动（判断滑动误差）
        Math.abs(changeX) > 10 || Math.abs(changeY) > 10 ? isMove = true : null;
        //=>只有发生移动再处理
        if (isMove) {
            //1.左右滑=>CHANGE-X=>ROTATE-Y (正比:CHANGE越大ROTATE越大)
            //2.上下滑=>CHANGE-Y=>ROTATE-X (反比:CHANGE越大ROTATE越小)
            //3.为了让每一次操作旋转角度小一点，我们可以把移动距离的1/3作为旋转的角度即可
            rotateX = rotateX - changeY / 3;
            rotateY = rotateY + changeX / 3;
            //=>赋值给魔方盒子
            $(this).css('transform', `scale(0.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
            //=>让当前旋转的角度成为下一次起始的角度
            this.rotateX = rotateX;
            this.rotateY = rotateY;
        }
        //=>清空其它记录的自定义属性值
        ['strX', 'strY', 'changeX', 'changeY'].forEach(item => this[item] = null);
    };

    return {
        init: function () {
            $cubeBox.css('display', 'block');

            //=>手指操作CUBE,让CUBE跟着旋转
            let cube = $cube[0];
            cube.rotateX = -35;
            cube.rotateY = 35;//=>记录初始的旋转角度（存储到自定义属性上）
            $cube.on('touchstart', start)
                .on('touchmove', move)
                .on('touchend', end);
            /*=>点击每一个面跳转到详情区域对应的页面*/
                 }
    }
})();
/*messageRender.init();*/
/*HASH*/
let url = window.location.href,
    well = url.indexOf('#'),
    hash = well === -1 ? null : url.substr(well + 1);
switch (hash) {
    case 'loading':
        loadRender.init();
        break;
    case 'phone':
        phoneRender.init();
        break;
    case 'message':
        messageRender.init();
        break;
    case 'cube':
        cubeRender.init();
        break;
    default:
        loadRender.init();
}