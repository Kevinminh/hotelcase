## Features

- Manage and book rooms for a specific hotel (customers & managers)
- Book rooms within specific category (double bed, single bed etc), for a specific period.
- Reserve rooms (example room 247).
- Managers should be able to see the history of the room (bookings, cancelations, customer details, damages etc.)
- Nice to have: Loyality program

## MUST HAVE

- OK Managers and customers must be able to book room in category (singlebed, doublebed) or a specific room.
- OK Hotelroom can be reserved for a specific period
- OK A room should not be able to be booked twice
- OK Auditlog / history must be available per room / per customer
- OK Personal customer information must be stored securely
- The system should be able to integrate with other solutions

## LOCAL START SEED

- db:seed-roles
- db:assign-roles
- db:seed-rooms

TO DELETE DB:

- db:db-delete
