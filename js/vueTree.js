$(function () {
	Vue.component('item', {
		template: '#item-template',
		props: {
			model: [],
			myInit: false,
			isRoot: false
		},
		data: function () {
			if(this.model.firstDeep==1){
				return {
					open: true
				}
			}
			else{
				return {
					open: false
				}
			}
		},
		watch: {
			myInit: function(val) {
				if (!this.isRoot){
					this.open = !this.isFolder;
				}
			}
		},
		computed: {
			isFolder: function () {
				return this.model.children && this.model.children.length;
			}
		},
		methods: {
			toggle: function () {
				if (this.isFolder) {
					this.open = !this.open;
				}
			},
			changeType: function () {
				if (!this.isFolder) {
					Vue.set(this.model, 'children', []);
					this.open = true;
				}
			}
		}
	});
	var  getCategoriesByPSUrl="json/getCategoriesByPS.json";
	var  getKnowledgesByPSUrl="json/getKnowledgesByPS.json";
	var mycategories=initData(getCategoriesByPSUrl,"");
	var cate={
		firstDeep:1,
		children:mycategories.data
	};
	var vm = new Vue({
		el: '.left',
		data:{
			treeData:cate,
			hovers:1,
			initItem: false
		},
		methods:{
			reCategories:function () {
				var myUrl="";
				if(this.hovers==1){
					myUrl=getCategoriesByPSUrl;
				}else if(this.hovers==2){
					myUrl=getKnowledgesByPSUrl;
				}
				var categoriesData={
					phase:this.phase,
					subject:this.subject
				};
				var mycategories=initData(myUrl,categoriesData,"");
				var myobject={
					firstDeep:1,
					children:mycategories.data
				};
				this.treeData=myobject;
			}
		}
	});
	$(".tree").on("click",".nameBrdr em",function (){
		$(".nameBrdr").each(function () {
			$(this).removeClass("hovers");
		});
		$(this).parent().addClass("hovers");
		
	});
	$(".tabs").find("li").click(function (){
		vm.hovers=parseInt($(this).attr("data-code"));
		if(vm.hovers==1){
			vm.initItem = true;
		}else if(vm.hovers==2){
			vm.initItem = true;
		}
		Vue.nextTick(function(){
			vm.initItem = false;
		});
		$(".nameBrdr").each(function () {
			$(this).removeClass("hovers");
			$(this).find(".hovers").removeClass("hovers");
		});
		vm.reCategories();
	});
function initData(myUrl,myjson) {
	var mydata;
	$.ajax({
		url:myUrl,
		data:myjson,
		type: "post",
		dataType:'json',
		async:false
	}).done(function (data) {
		if(data.status == "0" ){
			mydata=data;
		}
	});
	return mydata;
}
});