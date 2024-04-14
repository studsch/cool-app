def is_tp(sim_matrix, test_movies, movie, sim_koef = 0.8):
    for i in test_movies:
        if sim_matrix.loc[i, movie] >= sim_koef:
            return True
    return False