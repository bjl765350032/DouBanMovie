/**
 * Created by Administrator on 2018/4/13.
 */
var app={
    init(){
        this.bind(),
        click.init($("#now"),'http://api.douban.com/v2/movie/in_theaters')
        //click.init($("#near"),'http://api.douban.com/v2/movie/coming_soon')
    },
    bind(){
        $('.main_left>div').on('click',function(){
            if($(this).index()===1){
                click.init($("#near"),'http://api.douban.com/v2/movie/coming_soon')
            }
            else if($(this).index()===2){
                click.init($("#top"),'http://api.douban.com/v2/movie/top250')
            }


            $(this).addClass('active').siblings().removeClass('active')
            $('.main_right>div').hide().eq($(this).index()).fadeIn()
            console.log($(this).index())
        });
        window.ontouchmove = function(e){
            e.preventDefault()
        };

        $('.main_right').each(function(){
            this.ontouchmove = function(e){
                e.stopPropagation()
            }
        })
    }
}



var click={
    init(id,url){
        this.$now=id,
            this.url=url,
            this.next()
    },
    next(){
        console.log(this.$now.height())
        this.$container=this.$now.find('.container')
        this.isFinish=false,
            this.index=0,
        this.bind()
        this.start()
    },
    bind(){
        let e=this
        this.$container.scroll(function(e){
            console.log(e.$now.height())
            let nowHeight=e.$now.height()+e.$now.scrollTop()
            let containerHeight=e.$now.height()
            if(!e.isFinish && nowHeight>containerHeight){
                e.start()
            }
        })
    },
    start(){
        let e=this
        this.getData((data)=>{
            e.render(data)
            console.log(data)
        })
    },
    getData(callback){
        let e=this
        $.ajax({
            type: "get",
            async: true,
            url:e.url,
            data: {
                start: e.index||0
            },
            //url: 'http://api.douban.com/v2/movie/in_theaters',
            dataType:'jsonp',
            success: function (ret) {
                console.log(ret)
                e.index += 1;
                console.log(e.index)
                if(e.index <= ret.total){
                    e.start()
                }else{
                    e.isFinish = true
                }
              callback&&callback(ret)
            }, error: function () {
                console.log('fail');
            }
        });
    },
    render(data){
        let e=this
        data.subjects.forEach((movie)=>{
            e.$container.append(Add.content(movie))
        })
    }

}


var Add={
    content(movie){
        var template=`<div class="content">
          <div class="content_l"><img src="" alt=""/></div>
                <div class="content_r">
          <h2></h2>
        <div class="score">
            <span class="score_l"></span>分/ <span class="score_r"></span>收藏
        </div>
        <div class="time">
            <span class="time_l"> </span><span class="time_r">/</span>
        </div>
        <div class="director">
            导演:<span></span>
        </div>
        <div class="actor">
            主演：<span></span>
        </div>
        </div>
        </div>
        <hr/>`
        var $node=$(template);
        $node.find('img').attr('src',movie.images.medium);
        function Find(key,val){
            $node.find(key).text(val)
        }
        Find('h2',movie.title);
        Find('.score_l',movie.rating.average);
        Find('.score_r',movie.collect_count);
        Find('.time_l',movie.year)
        Find('.time_r',movie.genres.join(' / '))
        Find('.director span',function(){
            let directorArr=[];
            movie.directors.forEach((item)=>{
                directorArr.push(item.name)
            })
            return directorArr.join('/')
        })
        Find('.actor span',function(){
            let directorArr=[];
            movie.casts.forEach((item)=>{
                directorArr.push(item.name)
            })
            return directorArr.join('/')
        })
        return $node
    }

}


app.init()