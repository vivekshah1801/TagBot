# imports

def add_to_db(userid, serverid):
    # check the (userid, serverid) pair in database
    # if present
        # do nothing in the database
        return "Successfully updated"
    # else
        # save (userid, serverid) pair to database
        return "Sucessfully added"


def delete_from_db(userid, serverid):
    # check the (userid, serverid) pair in database
    # if present
        # delete (userid, serverid) pair to database
        return "Successfully deleted the encoding"
    # else
        return "Encoding not present for user for that server"


def get_userids(serverid):
    # return the list of userids
    return userids
    # for error return []
    return []