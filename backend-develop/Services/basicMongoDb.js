// Parameters:

// [conditions] <Object>
// [update] <Object>
// [options] <Object>
// [callback] <Function>
// Returns:

// <Query>
// See:

// mongodb
// Finds a matching document, updates it according to the update arg, passing any options, and returns the found document (if any) to the callback. The query executes immediately if callback is passed else a Query object is returned.

// Options:

// new: bool - if true, return the modified document rather than the original. defaults to false (changed in 4.0)
// upsert: bool - creates the object if it doesn't exist. defaults to false.
// sort: if multiple docs are found by the conditions, sets the sort order to choose which doc to update
// select: sets the document fields to return
// Examples:

// A.findOneAndUpdate(conditions, update, options, callback) // executes
// A.findOneAndUpdate(conditions, update, options)  // returns Query
// A.findOneAndUpdate(conditions, update, callback) // executes
// A.findOneAndUpdate(conditions, update)           // returns Query
// A.findOneAndUpdate()                             // returns Query