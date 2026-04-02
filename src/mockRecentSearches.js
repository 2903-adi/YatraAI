// Demo data — wire to your API later
export const recentSearches = [
  { from: 'Rajkot', to: 'Delhi', tier: 'budget', via: 'Ahmedabad', kind: 'transport', leg: 'return', price: 4200, ago: '2 min ago' },
  { from: 'Mumbai', to: 'Goa', tier: 'comfort', via: 'Direct', kind: 'vacation', days: 5, price: 48200, ago: '5 min ago' },
  { from: 'Bangalore', to: 'Kochi', tier: 'budget', via: 'Coimbatore', kind: 'transport', leg: 'oneway', price: 1850, ago: '8 min ago' },
  { from: 'Pune', to: 'Jaipur', tier: 'comfort', via: 'Direct flight', kind: 'vacation', days: 4, price: 55600, ago: '11 min ago' },
  { from: 'Chennai', to: 'Hyderabad', tier: 'budget', via: 'Vijayawada', kind: 'transport', leg: 'return', price: 3100, ago: '14 min ago' },
  { from: 'Kolkata', to: 'Darjeeling', tier: 'budget', via: 'Siliguri', kind: 'vacation', days: 6, price: 28900, ago: '18 min ago' },
  { from: 'Delhi', to: 'Manali', tier: 'comfort', via: 'Chandigarh', kind: 'vacation', days: 5, price: 62400, ago: '22 min ago' },
  { from: 'Ahmedabad', to: 'Udaipur', tier: 'budget', via: 'Direct rail', kind: 'transport', leg: 'oneway', price: 920, ago: '26 min ago' },
  { from: 'Indore', to: 'Mumbai', tier: 'budget', via: 'Bhopal', kind: 'transport', leg: 'return', price: 2600, ago: '31 min ago' },
  { from: 'Hyderabad', to: 'Visakhapatnam', tier: 'comfort', via: 'Direct', kind: 'transport', leg: 'oneway', price: 3400, ago: '35 min ago' },
  { from: 'Lucknow', to: 'Varanasi', tier: 'budget', via: 'Direct', kind: 'vacation', days: 3, price: 19800, ago: '41 min ago' },
  { from: 'Surat', to: 'Bangalore', tier: 'comfort', via: 'Mumbai', kind: 'transport', leg: 'return', price: 8900, ago: '44 min ago' },
  { from: 'Nagpur', to: 'Pune', tier: 'budget', via: 'Direct', kind: 'transport', leg: 'oneway', price: 1100, ago: '48 min ago' },
  { from: 'Patna', to: 'Delhi', tier: 'budget', via: 'Kanpur', kind: 'vacation', days: 4, price: 34200, ago: '52 min ago' },
  { from: 'Chandigarh', to: 'Amritsar', tier: 'comfort', via: 'Direct', kind: 'transport', leg: 'return', price: 2400, ago: '58 min ago' },
  { from: 'Jaipur', to: 'Jodhpur', tier: 'budget', via: 'Direct', kind: 'transport', leg: 'oneway', price: 750, ago: '1 hr ago' },
  { from: 'Kochi', to: 'Mysore', tier: 'budget', via: 'Bangalore', kind: 'vacation', days: 5, price: 31500, ago: '1 hr ago' },
  { from: 'Goa', to: 'Hampi', tier: 'budget', via: 'Hubli', kind: 'vacation', days: 4, price: 26800, ago: '1 hr ago' },
  { from: 'Bhubaneswar', to: 'Puri', tier: 'comfort', via: 'Direct', kind: 'transport', leg: 'return', price: 1800, ago: '1 hr ago' },
  { from: 'Vadodara', to: 'Surat', tier: 'budget', via: 'Direct', kind: 'transport', leg: 'oneway', price: 450, ago: '2 hr ago' },
  { from: 'Guwahati', to: 'Shillong', tier: 'comfort', via: 'Direct', kind: 'vacation', days: 3, price: 22400, ago: '2 hr ago' },
  { from: 'Madurai', to: 'Rameswaram', tier: 'budget', via: 'Direct', kind: 'transport', leg: 'return', price: 1600, ago: '2 hr ago' },
  { from: 'Ranchi', to: 'Kolkata', tier: 'budget', via: 'Asansol', kind: 'transport', leg: 'oneway', price: 980, ago: '2 hr ago' },
  { from: 'Thiruvananthapuram', to: 'Kanyakumari', tier: 'budget', via: 'Nagercoil', kind: 'vacation', days: 2, price: 14200, ago: '3 hr ago' },
  { from: 'Agra', to: 'Delhi', tier: 'comfort', via: 'Direct', kind: 'transport', leg: 'return', price: 2200, ago: '3 hr ago' },
  { from: 'Dehradun', to: 'Rishikesh', tier: 'budget', via: 'Direct', kind: 'transport', leg: 'oneway', price: 320, ago: '3 hr ago' },
  { from: 'Mangalore', to: 'Goa', tier: 'comfort', via: 'Karwar', kind: 'vacation', days: 5, price: 45100, ago: '4 hr ago' },
  { from: 'Srinagar', to: 'Leh', tier: 'comfort', via: 'Flight', kind: 'vacation', days: 7, price: 89500, ago: '4 hr ago' },
  { from: 'Coimbatore', to: 'Ooty', tier: 'budget', via: 'Mettupalayam', kind: 'transport', leg: 'return', price: 1400, ago: '5 hr ago' },
  { from: 'Varanasi', to: 'Bodh Gaya', tier: 'budget', via: 'Gaya', kind: 'vacation', days: 3, price: 17600, ago: '5 hr ago' },
]

export function formatInr(n) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
}
