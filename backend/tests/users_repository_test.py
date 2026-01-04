import repository.users_repository as users_repository


def test_all_users():
    users_repository.create_user("test", "pass")
    all_users = users_repository.get_all_users()

    assert len(all_users) == 1


def test_get_by_username():
    users_repository.create_user("test", "pass")
    users_repository.create_user("test2", "pass")
    user1 = users_repository.get_user_by_username("test")
    user2 = users_repository.get_user_by_username("test2")
    nonExistingUser = users_repository.get_user_by_username("nonexisting")

    assert user1 is not None
    assert user1.username == "test"

    assert user2 is not None
    assert user2.username == "test2"

    assert nonExistingUser is None
