/* eslint-disable */

const liistSchema = {
  "type": "object",
  "properties": {
    "liists": {
      "type": "array",
      "minItems": 1,
      "maxItems": 50,
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "unique": true,
            "faker": "random.uuid"
          },
          "owner": {
            "type": "string",
            "faker": "name.findName"
          },
          "name": {
            "type": "string",
            "faker": "random.words"
          },
          "description": {
            "type": "string",
            "faker": "lorem.sentence"
          },
          "length": {
            "type": "integer",
            "maximum": 100,
            "minimum": 0
          },
          "updatedDate": {
            "type": "string",
            "faker": "date.recent"
          },
          "songs": {
            "type": "array",
            "minItems": 5,
            "maxItems": 15,
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "unique": true,
                  "faker": "random.uuid"
                },
                "title": {
                  "type": "string",
                  "faker": "random.words"
                },
                "artist": {
                  "type": "string",
                  "faker": "name.findName"
                },
                "addedBy": {
                  "type": "string",
                  "faker": "name.findName"
                },
                "addedDate": {
                  "type": "string",
                  "faker": "date.recent"
                },
                "stars": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 100
                }
              },
              "required": ["id", "title", "artist", "addedBy", "addedDate", "stars"]
            }
          }
        },
        "required": ["id", "owner", "name", "description", "length", "updatedDate", "songs"]
      }
    }
  },
  "required": ["liists"]
};

module.exports = liistSchema;