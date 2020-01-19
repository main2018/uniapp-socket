const mixin_share_building = {
  methods: {
    share(building) {
      // #ifdef H5
      const {
        tagline = '',
        name_project = '',
        province_name = '',
        city_name = '',
        building_status = '',
        building_type = '',
        
        start_price,
        average_price,
        max_price,
        
        cover: imgUrl,
      } = (building && building.building_info) || {}
      const startPrice = start_price ? `起价${start_price}元/㎡` : ''
      const averagePrice = average_price ? `均价${average_price}元/㎡` : ''
      const maxPrice = max_price ? `顶价${max_price}元/㎡` : ''
      const {name = '', mobile = ''} = (building && building.contact_info) || {}
      const newsletter = `${name} ${mobile}`
      const {id, mu, sf, at} = this.option || {}
      const shareConfig = {
        title: `${tagline} 【${province_name}·${city_name}·${name_project}】 [${building_status}][${building_type}]`,
        // desc: `${startPrice} ${averagePrice} ${maxPrice}\n ${newsletter}`,
        desc: `${startPrice} ${averagePrice}...\n ${newsletter}`,
        imgUrl: this.$baseUrl + imgUrl,
        link: `${this.$baseUrl}page/agency_pushing/#/pages/building/detail?id=${id}&mu=${mu}&sf=${sf}&at=${at}`
      }
      console.log('shareConfig', shareConfig);
      this.$weixin.share(shareConfig, this.shareStatistics)
      // #endif
    },
    shareStatistics() {
      const {id: id_subject, mu, sf, at} = this.option || {}
      const data = {
        subject: 2,
        id_subject,
        type: 2,
        mu,
        sf,
        at,
        openid: this.openid
      }
      this.$api.statistics(data)
    },
  }
}

export {
  mixin_share_building
}
