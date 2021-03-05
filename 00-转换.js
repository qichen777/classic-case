async getViewingTrend() {
      this.loading3 = true
      const url = 'MediaService/Program/getProgramCategoryList.jsp'
      const data = {
        authCode: 'WMfe4iL3GgbhgN1FZ4zkdpoTUPgykVuRvcz/nOxEMAs=',
        dbName: '1NZbahIAyv4CxhzxoqsWAQ==',
        sdate: '2021-01-01', // yyyy-mm-dd
        edate: '2021-01-31' // yyyy-mm-dd
      }
      const res = await this.$axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' }
      })
      if (res.status !== 200) {
        return this.$message.error(res.statusText)
      }
      // 请求成功
      const arr2 = Object.keys(res.data[0]) // 每条数据的属性key
      arr2.forEach(item => {
        if (item.indexOf('人数') >= 0) {
          this.interval++
        }
      })
      const arr1 = Object.keys(omit(res.data[0], ['day_id', 'market'])) // 去除day_id、market后

      res.data.forEach(item => {
        // 每条数据中总的人数 时间 次数
        let sumRen = 0
        let sumShi = 0
        let sumCi = 0

        // 每条总的人数 时间 次数
        for (const k in item) {
          if (k.indexOf('人数') >= 0) {
            sumRen += parseFloat(item[k])
          } else if (k.indexOf('次数') >= 0) {
            sumCi += parseFloat(item[k])
          } else if (k.indexOf('时间') >= 0) {
            sumShi += parseFloat(item[k])
          }
        }
        // 给每一条数据添加总的属性和对应的值
        item.sumRen = sumRen
        item.sumShi = sumShi
        item.sumCi = sumCi
      })
      res.data.forEach(item => {
        for (const k of arr1) {
          if (k.indexOf('人数') >= 0) {
            item[`${k}(%)`] = parseFloat(item[k]) / item.sumRen
          } else if (k.indexOf('次数') >= 0) {
            item[`${k}(%)`] = parseFloat(item[k]) / item.sumCi
          } else if (k.indexOf('时间') >= 0) {
            item[`${k}(%)`] = parseFloat(item[k]) / item.sumShi
          }
        }
      })
      this.chartData1.rows = res.data
      this.chartDataRowInit = ['day_id'].concat(arr1)
      this.chartData1.columns = this.chartDataRowInit

      this.chartDataRowRatio = ['day_id']
      Object.keys(this.chartData1.rows[0]).forEach(item => {
        if (item.indexOf('%') >= 0) {
          this.chartDataRowRatio.push(item)
        }
      })

      const stackShi = []
      const stackRen = []
      const stackCi = []
      this.chartData1.columns.forEach(item => {
        if (item.indexOf('人数') >= 0) {
          stackRen.push(item)
        } else if (item.indexOf('次数') >= 0) {
          stackCi.push(item)
        } else if (item.indexOf('时间') >= 0) {
          stackShi.push(item)
        }
      })
      this.chartSettings1 = {
        stack: {
          时间: stackShi,
          人数: stackRen,
          次数: stackCi
        }
      }
      this.loading3 = false
    }
