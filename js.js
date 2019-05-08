let loading = false; // 滚动加载    

$(document).on("pageInit",function(e, pageId, $page){
    if(pageId == "Drop-down-refresh"){
        loading = false;
    }else if(pageId == "details"){
        const app = new Vue({
            el:"#details",
            data:{
                url:'https://cnodejs.org/api/v1',
                paraId:'', // 参数id
                topicDetails:'',
                title:'',
            },
            mounted() {
                this.getUrlPara();
                this.getTopicsDetails();
            },
            methods: {
                getTopicsDetails(){
                    let _this = this;
                    $.showPreloader(); // 显示加载指示器
                    // 模拟加载延迟
                    setTimeout(function(){
                        axios.get(_this.url + '/topic/' + _this.paraId)
                        .then(function(res){
                            console.log(res)
                            _this.topicDetails = res.data.data.content;
                            _this.title = res.data.data.title;
                            $.hidePreloader();// 隐藏加载指示器
                        })
                        .catch(function(error){
                            console.log(error)
                            $.hidePreloader();
                            $.alert("加载失败")
                        })
                    },0)
                   
                },
                // 获取参数id
                getUrlPara(){
                    let _this = this;
                    let url = document.location.toString();
                    let arrUrl = url.split("=");
                    _this.paraId = arrUrl[1];
                    console.log(_this.paraId)
                    return _this.paraId;
                }
            },
        });   
    }
    
});
    // 添加'refresh'监听器  下拉刷新
$(document).on("refresh",".pull-to-refresh-content",function(e){
    //模拟1s的加载过程
    setTimeout(function(){
        // 下拉后执行刷新
        location.reload();
    },1000)
});
    
    // 注册'infinite'事件处理函数 滚动加载
$(document).on('infinite', '.infinite-scroll-bottom',function() {
    // 如果正在加载，则退出
    if (loading) return;
    // 设置flag
     loading = true;
    // 模拟1s的加载过程
    setTimeout(function() {
        app.pageIndex++;
        if(app.lists.length >= 100){
            //加载完毕，则注销无限加载事件，以防不必要的加载
                $.alert("没有更多了...")
                loading = true;
                $.detachInfiniteScroll($('.infinite-scroll'));
            // 删除加载提示符
                $('.infinite-scroll-preloader').remove();
                return;
        }
        app.getTopics();
        console.log("加载完成")
        loading = false;
    },1000);

});

