#![deny(clippy::all)]

use base64::{engine::general_purpose, Engine as _};
use sha2::Digest;

#[macro_use]
extern crate napi_derive;

#[napi]
pub fn calculate_sha256(input_bytes: &[u8]) -> String {
  let digest = sha2::Sha256::digest(input_bytes);
  general_purpose::STANDARD_NO_PAD.encode(digest)
}

#[napi]
pub fn calculate_sha384(input_bytes: &[u8]) -> String {
  let digest = sha2::Sha384::digest(input_bytes);
  general_purpose::STANDARD_NO_PAD.encode(digest)
}

#[napi]
pub fn calculate_sha512(input_bytes: &[u8]) -> String {
  let digest = sha2::Sha512::digest(input_bytes);
  general_purpose::STANDARD_NO_PAD.encode(digest)
}
