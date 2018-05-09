
export const parseB32StringtoUintArray = ( b32, num ) => {
  let out = []
  for (let i=0; i<num; i++){
    out[i] = parseInt( b32.slice(i*4,4), 16 )
  }
  return out
}
