package vn.hust.omni.sale.shared.common_model;

public class PagingFilterRequest {
    private int limit = 50;
    private int page = 1;

    public int getLimit() {
        if (limit <= 0)
            return 50;
        else return Math.min(limit, 250);
    }

    public void setLimit(int limit) {
        if (limit <= 0)
            this.limit = 50;
        else this.limit = Math.min(limit, 250);
    }

    public int getPage() {
        if (page <= 0)
            return 1;
        else
            return page;
    }

    public void setPage(int page) {
        if (page <= 0)
            this.page = 1;
        else
            this.page = page;
    }

    public void setLimitNoCheck(int limit) {
        this.limit = limit;
    }
}
