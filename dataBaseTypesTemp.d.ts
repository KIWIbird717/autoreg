
interface DB {
  _id: string,
  nick: string,
  mail: string,
  password: string,
  accountsManagerFolder: [
    {
      key: string,
      folder: string,
      dopTitle: string,
      accountsAmount: number,
      country: string,
      latestActivity: Date,
      banned: number,
      accounts: [
        {
          key: string,
          avatar: string,
          phoneNumber: string,
          resting: Date | number,
          fullName: string,
          secondFacAith: string,
          proxy: string,
          latestActivity: Date,
          status: string,
        }
      ]
    }
  ],
  proxyManagerFolder: [
    {
      key: string,
      folder: string,
      dopTitle: string,
      proxiesAmount: number,
      country: string,
      latestActivity: Date,
      proxies: [
        {
          key: string,
          ip: string,
          port: string,
          login: string,
          pass: string,
          type: string,
          delay: string,
          status: string
        }
      ]
    }
  ],
  recentAutoregActivity: [
    {
      key: string,
      status: 'success' | 'warning' | 'error',
      title: string,
      description: string,
      date: Date
    }
  ],
  
}