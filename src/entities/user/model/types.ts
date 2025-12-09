// export interface UserDTO {}

export interface User {
  id: string
  image: string
  username: string
  firstName: string
  lastName: string
  age: number
  email: string
  phone: string
  address: Address
  company: Company
}

export interface Address {
  address: string
  state: string
  city: string
}

export interface Company {
  name: string
  title: string
}
