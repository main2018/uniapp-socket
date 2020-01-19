<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
      // this.$weixin.wxAuthorize()
      const openid = 'oacUt1CWnfYVJh6A8Yuh5XX4hBOw'
      this.$store.commit('SET_OPENID', openid)
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
