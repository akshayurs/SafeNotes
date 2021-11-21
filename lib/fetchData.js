export default async function fetchData(url, options = {}) {
  try {
    const res = await fetch(url, options)
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
    return err
  }
}
