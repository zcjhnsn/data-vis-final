treemap(kill_by_hour_group, index=c("hours","variable"), vSize="sum_hour", type="index", fontsize.labels=c(15,12), title='Fatalities by time of the day', fontcolor.labels=c("white","orange"), fontface.labels=c(2,1), bg.labels=c("transparent"),  align.labels=list(
    c("center", "center"), c("right", "bottom")), overlap.labels=0.5, inflate.labels=F,
)