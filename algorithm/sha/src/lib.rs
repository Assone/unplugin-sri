#![deny(clippy::all)]

use base64::{engine::general_purpose, Engine as _};
use ring::digest::{digest, SHA256, SHA384, SHA512};

#[macro_use]
extern crate napi_derive;

#[napi]
pub fn calculate_sha256(input_bytes: &[u8]) -> String {
  let digest = digest(&SHA256, input_bytes);
  general_purpose::STANDARD_NO_PAD.encode(digest)
}

#[napi]
pub fn calculate_sha384(input_bytes: &[u8]) -> String {
  let digest = digest(&SHA384, input_bytes);
  general_purpose::STANDARD_NO_PAD.encode(digest)
}

#[napi]
pub fn calculate_sha512(input_bytes: &[u8]) -> String {
  let digest = digest(&SHA512, input_bytes);
  general_purpose::STANDARD_NO_PAD.encode(digest)
}
