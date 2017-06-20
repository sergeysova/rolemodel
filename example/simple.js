const { role } = require('../src/rolemodel')

const Empty = role`Empty`([], {
  user: {
    view: false,
    edit: false,
    create: false,
    remove: false,
    block: false,
    unblock: false,
  },
  post: {
    view: false,
    edit: false,
    create: false,
    remove: false,
  },
})

const BaseUser = role`BaseUser`([Empty], {
  user: { view: true },
  post: { view: true },
})

const ActiveUser = role`ActiveUser`([BaseUser], {
  post: { create: true, edit: true, remove: true },
})

const Moderator = role`BaseUser`([ActiveUser], {
  user: { block: true, unblock: true },
})

const Admin = role`Admin`([ActiveUser, Moderator], {
  user: {
    view: true,
    edit: true,
    create: true,
    remove: true,
  },
})

